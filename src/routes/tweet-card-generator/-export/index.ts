import { domToPng, domToCanvas, createContext, destroyContext, type Context } from 'modern-screenshot'
import { GIFEncoder, quantize, applyPalette } from 'gifenc'
import { gifOutputSize, frameIndexes, frameStepFor, samplePalettePixels } from './gif-helpers'
import { generateFilename, downloadBlob, waitForPaint } from '../-utils'

interface ExportOptions {
    width: number
    height: number
    scale?: number
    quality?: number
}

/** What was saved, so the UI can confirm it ("1600×900 · 240 KB") */
export interface ExportResult {
    filename: string
    width: number
    height: number
    bytes: number
}

interface GifOptions extends ExportOptions {
    text: string
    speed: number // chars per second
    fps: number
    loop: boolean
    onProgress?: (progress: number) => void
}


/**
 * Capture the canvas as a high-quality PNG at exact export dimensions
 */
export async function exportAsPng(
    element: HTMLElement,
    username: string,
    options: ExportOptions
): Promise<ExportResult> {
    const { width, height } = options

    try {
        // Capture the element at exact export dimensions
        // modern-screenshot will render the DOM at the specified size
        const dataUrl = await domToPng(element, {
            width,
            height,
            scale: 1, // 1:1 pixel ratio for exact dimensions
            style: {
                // Override the preview transform - render at 1:1
                transform: 'none',
                width: `${width}px`,
                height: `${height}px`,
            },
            // High quality settings
            quality: 1,
            // Handle CORS for external images
            fetch: {
                requestInit: {
                    mode: 'cors',
                    credentials: 'same-origin',
                },
            },
        })

        // Convert data URL to image, then convert to blob (high quality, no watermark)
        const img = new Image()
        return await new Promise<ExportResult>((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')!
                
                // Draw the captured image
                ctx.drawImage(img, 0, 0, width, height)
                
                // Convert to blob and download (high quality, no watermark)
                // Use maximum quality (1.0) for PNG export
                canvas.toBlob((blob) => {
                    if (blob) {
                        const filename = generateFilename(username, 'png')
                        downloadBlob(blob, filename)
                        resolve({ filename, width, height, bytes: blob.size })
                    } else {
                        reject(new Error('Failed to create blob'))
                    }
                }, 'image/png', 1.0) // Maximum quality PNG
            }
            img.onerror = reject
            img.src = dataUrl
        })
    } catch (error) {
        console.error('PNG export failed:', error)
        throw error
    }
}

/**
 * Copy the canvas as PNG image to clipboard
 */
export async function copyToClipboard(
    element: HTMLElement,
    options: ExportOptions
): Promise<void> {
    const { width, height } = options

    try {
        // Capture the element at exact export dimensions
        const dataUrl = await domToPng(element, {
            width,
            height,
            scale: 1,
            style: {
                transform: 'none',
                width: `${width}px`,
                height: `${height}px`,
            },
            quality: 1,
            fetch: {
                requestInit: {
                    mode: 'cors',
                    credentials: 'same-origin',
                },
            },
        })

        // Convert data URL to blob
        const img = new Image()
        await new Promise<void>((resolve, reject) => {
            img.onload = async () => {
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')!
                
                // Draw the captured image
                ctx.drawImage(img, 0, 0, width, height)
                
                // Convert to blob
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            // Copy to clipboard using Clipboard API
                            await navigator.clipboard.write([
                                new ClipboardItem({
                                    'image/png': blob
                                })
                            ])
                            resolve()
                        } catch (clipboardError) {
                            // Fallback: some browsers don't support clipboard.write
                            console.error('Clipboard API failed:', clipboardError)
                            reject(new Error('Clipboard not supported. Try downloading instead.'))
                        }
                    } else {
                        reject(new Error('Failed to create image blob'))
                    }
                }, 'image/png', 1.0)
            }
            img.onerror = reject
            img.src = dataUrl
        })
    } catch (error) {
        console.error('Copy to clipboard failed:', error)
        throw error
    }
}

/**
 * Capture an element with typewriter animation as GIF
 * Uses gifenc. One modern-screenshot context is reused for every frame (fonts and images
 * are embedded once), frames render straight to a canvas at GIF size (max 800px), the
 * palette comes from a pixel sample, and we yield to the event loop so the tab stays alive.
 */
export async function exportAsGif(
    element: HTMLElement,
    username: string,
    options: GifOptions
): Promise<ExportResult> {
    const { text, width, height, fps, loop, onProgress } = options

    // Find the text element to animate
    const textElement = element.querySelector('[data-tweet-text]') as HTMLElement
    if (!textElement) {
        throw new Error('Tweet text element not found. Add data-tweet-text attribute.')
    }

    // Store original content properly
    const originalNodes = Array.from(textElement.childNodes)
    const yieldToBrowser = () => new Promise<void>((r) => setTimeout(r, 0))
    let context: Context<HTMLElement> | undefined

    try {
        const out = gifOutputSize(width, height)
        const frameStep = frameStepFor(text.length) // ~20 frames
        const frameDelay = Math.round((1000 / fps) * frameStep)
        const indexes = frameIndexes(text.length, frameStep)

        // Created once: re-cloned from the live DOM on every domToCanvas call, so text
        // changes show up, while fonts/images fetched for it are cached in the context.
        context = await createContext(element, {
            width,
            height,
            scale: out.scale,
            style: { transform: 'none', width: `${width}px`, height: `${height}px` },
        })

        const frames: { data: Uint8ClampedArray; delay: number }[] = []
        let gifWidth = out.width
        let gifHeight = out.height

        for (let n = 0; n < indexes.length; n++) {
            const i = indexes[n]
            const isLast = n === indexes.length - 1
            textElement.textContent = isLast ? text : text.slice(0, i) + '|'

            await waitForPaint()
            const canvas = await domToCanvas(context)
            gifWidth = canvas.width
            gifHeight = canvas.height
            const data = canvas.getContext('2d')!.getImageData(0, 0, gifWidth, gifHeight).data
            frames.push({ data, delay: isLast ? 1000 : frameDelay }) // 1s hold on the full text

            onProgress?.(((n + 1) / indexes.length) * 0.8) // 80% for frame capture
            await yieldToBrowser()
        }

        onProgress?.(0.85)
        await yieldToBrowser()

        const palette = quantize(samplePalettePixels(frames.map((f) => f.data)), 256)
        onProgress?.(0.9)
        await yieldToBrowser()

        const gif = GIFEncoder()
        for (let i = 0; i < frames.length; i++) {
            const { data, delay } = frames[i]
            const indexed = applyPalette(data, palette)
            gif.writeFrame(indexed, gifWidth, gifHeight, {
                palette: i === 0 ? palette : undefined, // Global palette on first frame
                delay,
                first: i === 0,
                repeat: i === 0 ? (loop ? 0 : -1) : undefined, // Set repeat on first frame only
            })
            onProgress?.(0.9 + ((i + 1) / frames.length) * 0.09)
            if (i % 4 === 3) await yieldToBrowser()
        }
        gif.finish()
        onProgress?.(1.0)

        const gifBytes = gif.bytes()
        const buffer = new ArrayBuffer(gifBytes.byteLength)
        new Uint8Array(buffer).set(gifBytes)
        const blob = new Blob([buffer], { type: 'image/gif' })
        const filename = generateFilename(username, 'gif')
        downloadBlob(blob, filename)
        return { filename, width: gifWidth, height: gifHeight, bytes: blob.size }
    } catch (error) {
        console.error('GIF export failed:', error)
        throw error
    } finally {
        // Put back the original nodes (not innerHTML) so React keeps its references
        textElement.replaceChildren(...originalNodes)
        if (context) destroyContext(context)
    }
}
