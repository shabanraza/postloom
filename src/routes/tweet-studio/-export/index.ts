import { domToPng, domToBlob } from 'modern-screenshot'
import GIF from 'gif.js'
import { generateFilename, downloadBlob } from '../-utils'

interface ExportOptions {
    width: number
    height: number
    scale?: number
    quality?: number
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
): Promise<void> {
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

        // Convert data URL to blob and download
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const filename = generateFilename(username, 'png')
        downloadBlob(blob, filename)
    } catch (error) {
        console.error('PNG export failed:', error)
        throw error
    }
}

/**
 * Capture an element with typewriter animation as GIF
 * Uses industry-standard optimizations: fewer frames, optimized quality, efficient encoding
 */
export async function exportAsGif(
    element: HTMLElement,
    username: string,
    options: GifOptions
): Promise<void> {
    const {
        text,
        width,
        height,
        fps,
        loop,
        onProgress
    } = options

    // Find the text element to animate
    const textElement = element.querySelector('[data-tweet-text]') as HTMLElement
    if (!textElement) {
        throw new Error('Tweet text element not found. Add data-tweet-text attribute.')
    }

    // Store original content properly
    const originalHTML = textElement.innerHTML
    const originalText = textElement.textContent || textElement.innerText || text

    // Industry standard: Limit to 10 frames max for fast encoding
    // Most successful GIF tools use 8-12 frames for typewriter effects
    const maxFrames = 10
    const frameStep = Math.max(1, Math.floor(text.length / maxFrames))
    const frameDelay = Math.round((1000 / fps) * frameStep) // Delay per frame in ms

    // Scale down dimensions aggressively for GIF encoding (industry practice)
    // Large dimensions exponentially increase encoding time
    // Most platforms cap GIFs at 600-800px for performance
    const maxGifDimension = 600
    const scaleRatio = Math.min(maxGifDimension / width, maxGifDimension / height, 1)
    const gifWidth = Math.round(width * scaleRatio)
    const gifHeight = Math.round(height * scaleRatio)

    let gif: GIF | null = null
    let timeoutId: NodeJS.Timeout | null = null

    try {
        // Industry-standard GIF settings optimized for speed
        // Quality 40-50: Lower quality = much faster encoding (used by Twitter, GIPHY)
        // Workers: 2-4 is optimal, but 2 is more stable
        gif = new GIF({
            workers: 2, // Reduced for stability
            quality: 50, // Lower quality = faster encoding (industry standard for web)
            width: gifWidth,
            height: gifHeight,
            repeat: loop ? 0 : -1,
            workerScript: undefined, // Use default worker script
        })

        const frames: HTMLCanvasElement[] = []
        const totalFrames = Math.ceil(text.length / frameStep) + 1

        // Capture frames efficiently
        for (let i = 0; i <= text.length; i += frameStep) {
            const displayText = text.slice(0, i) + (i < text.length ? '|' : '')
            
            // Update DOM
            textElement.innerHTML = ''
            textElement.textContent = displayText
            
            // Wait for render (single RAF is sufficient for most cases)
            await new Promise(r => requestAnimationFrame(r))
            await new Promise(r => setTimeout(r, 8)) // Minimal delay for render

            // Capture frame at original size first
            const blob = await domToBlob(element, {
                width,
                height,
                scale: 1,
                type: 'image/png',
                style: {
                    transform: 'none',
                    width: `${width}px`,
                    height: `${height}px`,
                },
            })

            // Convert to canvas and scale down for GIF (industry practice)
            const img = new Image()
            const canvas = document.createElement('canvas')
            canvas.width = gifWidth
            canvas.height = gifHeight
            const ctx = canvas.getContext('2d', { willReadFrequently: false })!

            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Image load timeout')), 2000)
                img.onload = () => {
                    clearTimeout(timeout)
                    // Scale down image for faster GIF encoding
                    ctx.drawImage(img, 0, 0, width, height, 0, 0, gifWidth, gifHeight)
                    resolve()
                }
                img.onerror = () => {
                    clearTimeout(timeout)
                    reject(new Error('Image load failed'))
                }
                img.src = URL.createObjectURL(blob)
            })

            frames.push(canvas)
            URL.revokeObjectURL(img.src)

            if (onProgress) {
                onProgress((i / text.length) * 0.7) // 70% for frame capture
            }
        }

        // Final frame (complete text)
        textElement.innerHTML = ''
        textElement.textContent = text
        await new Promise(r => requestAnimationFrame(r))
        await new Promise(r => setTimeout(r, 30)) // Reduced delay

        const endBlob = await domToBlob(element, {
            width,
            height,
            scale: 1,
            type: 'image/png',
            style: {
                transform: 'none',
                width: `${width}px`,
                height: `${height}px`,
            },
        })

        const endImg = new Image()
        const endCanvas = document.createElement('canvas')
        endCanvas.width = gifWidth
        endCanvas.height = gifHeight
        const endCtx = endCanvas.getContext('2d', { willReadFrequently: false })!

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('End image load timeout')), 2000)
            endImg.onload = () => {
                clearTimeout(timeout)
                // Scale down for GIF encoding
                endCtx.drawImage(endImg, 0, 0, width, height, 0, 0, gifWidth, gifHeight)
                resolve()
            }
            endImg.onerror = () => {
                clearTimeout(timeout)
                reject(new Error('End image load failed'))
            }
            endImg.src = URL.createObjectURL(endBlob)
        })

        frames.push(endCanvas)
        URL.revokeObjectURL(endImg.src)

        // Restore original content
        textElement.innerHTML = originalHTML

        // Add all frames to GIF (industry practice: batch add for better performance)
        frames.forEach((canvas, index) => {
            const delay = index === frames.length - 1 ? 1000 : frameDelay
            gif!.addFrame(canvas, { delay, copy: true })
        })

        // Render GIF with optimized timeout (20 seconds for web - industry standard)
        return new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => {
                if (gif) {
                    try {
                        gif.abort()
                    } catch (e) {
                        console.error('Error aborting GIF:', e)
                    }
                }
                reject(new Error('GIF encoding timed out. The GIF was scaled down to 600px for faster encoding. Try using a shorter text or smaller export size.'))
            }, 20000) // 20 seconds - industry standard for web GIF encoding

            gif.on('progress', (p: number) => {
                if (onProgress) {
                    // 70% frame capture + 30% encoding
                    onProgress(0.7 + p * 0.3)
                }
            })
            
            gif.on('finished', (blob: Blob) => {
                if (timeoutId) clearTimeout(timeoutId)
                try {
                    downloadBlob(blob, generateFilename(username, 'gif'))
                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
            
            gif.on('error', (error: Error) => {
                if (timeoutId) clearTimeout(timeoutId)
                reject(error)
            })

            try {
                gif.render()
            } catch (error) {
                if (timeoutId) clearTimeout(timeoutId)
                reject(error)
            }
        })
    } catch (error) {
        // Restore original content on error
        if (textElement) {
            textElement.innerHTML = originalHTML
        }
        if (timeoutId) clearTimeout(timeoutId)
        if (gif) {
            try {
                gif.abort()
            } catch (e) {
                // Ignore abort errors
            }
        }
        console.error('GIF export failed:', error)
        throw error
    }
}

/**
 * Estimate file size
 */
export function estimateFileSize(
    width: number,
    height: number,
    format: 'png' | 'gif',
    textLength: number = 0,
    fps: number = 20
): string {
    const pixels = width * height

    if (format === 'png') {
        const bytes = pixels * 1.5
        return formatBytes(bytes)
    } else {
        const frameCount = textLength > 0 ? Math.ceil((textLength / 50) * fps) : fps * 5
        const bytes = frameCount * pixels * 0.25
        return formatBytes(Math.min(bytes, 8 * 1024 * 1024))
    }
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
