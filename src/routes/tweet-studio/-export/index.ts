import { domToPng, domToBlob } from 'modern-screenshot'
import { GIFEncoder, quantize, applyPalette } from 'gifenc'
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
 * Add watermark to canvas
 */
function addWatermark(canvas: HTMLCanvasElement, width: number, height: number): void {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Watermark text
    const text = 'postloom.com'
    const fontSize = Math.max(12, Math.min(width, height) * 0.018) // Responsive font size (1.8% of smaller dimension)
    ctx.font = `500 ${fontSize}px system-ui, -apple-system, sans-serif`
    
    // Position in bottom-right corner with padding
    const padding = fontSize * 1.2
    const x = width - padding
    const y = height - padding
    
    // Measure text for background
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    const metrics = ctx.measureText(text)
    const textWidth = metrics.width
    const textHeight = fontSize
    
    // Draw semi-transparent background for better visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.fillRect(
        x - textWidth - padding * 0.3,
        y - textHeight - padding * 0.2,
        textWidth + padding * 0.6,
        textHeight + padding * 0.4
    )
    
    // Draw watermark text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)' // More visible
    ctx.fillText(text, x, y)
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

        // Convert data URL to image, add watermark, then convert to blob
        const img = new Image()
        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')!
                
                // Draw the captured image
                ctx.drawImage(img, 0, 0, width, height)
                
                // Add watermark
                addWatermark(canvas, width, height)
                
                // Convert to blob and download
                canvas.toBlob((blob) => {
                    if (blob) {
                        const filename = generateFilename(username, 'png')
                        downloadBlob(blob, filename)
                        resolve()
                    } else {
                        reject(new Error('Failed to create blob'))
                    }
                }, 'image/png', 1.0)
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
 * Capture an element with typewriter animation as GIF
 * Uses gifenc library - fast, reliable, and bulletproof for any content size
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

    try {
        // Calculate frame timing - use reasonable frame count for smooth animation
        const frameStep = Math.max(1, Math.floor(text.length / 20)) // ~20 frames for smooth animation
        const frameDelay = Math.round((1000 / fps) * frameStep) // Delay per frame in ms

        const frames: { canvas: HTMLCanvasElement; delay: number }[] = []

        // Capture frames efficiently
        for (let i = 0; i <= text.length; i += frameStep) {
            const displayText = text.slice(0, i) + (i < text.length ? '|' : '')
            
            // Update DOM
            textElement.innerHTML = ''
            textElement.textContent = displayText
            
            // Wait for render
            await new Promise(r => requestAnimationFrame(r))
            await new Promise(r => requestAnimationFrame(r))
            await new Promise(r => setTimeout(r, 16))

            // Capture frame
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

            // Convert to canvas
            const img = new Image()
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')!

            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Image load timeout')), 5000)
                img.onload = () => {
                    clearTimeout(timeout)
                    ctx.drawImage(img, 0, 0, width, height)
                    // Add watermark
                    addWatermark(canvas, width, height)
                    resolve()
                }
                img.onerror = () => {
                    clearTimeout(timeout)
                    reject(new Error('Image load failed'))
                }
                img.src = URL.createObjectURL(blob)
            })

            frames.push({ canvas, delay: frameDelay })
            URL.revokeObjectURL(img.src)

            if (onProgress) {
                onProgress((i / text.length) * 0.8) // 80% for frame capture
            }
        }

        // Final frame (complete text)
        textElement.innerHTML = ''
        textElement.textContent = text
        await new Promise(r => requestAnimationFrame(r))
        await new Promise(r => requestAnimationFrame(r))
        await new Promise(r => setTimeout(r, 50))

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
        endCanvas.width = width
        endCanvas.height = height
        const endCtx = endCanvas.getContext('2d')!

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('End image load timeout')), 5000)
            endImg.onload = () => {
                clearTimeout(timeout)
                endCtx.drawImage(endImg, 0, 0, width, height)
                // Add watermark
                addWatermark(endCanvas, width, height)
                resolve()
            }
            endImg.onerror = () => {
                clearTimeout(timeout)
                reject(new Error('End image load failed'))
            }
            endImg.src = URL.createObjectURL(endBlob)
        })

        frames.push({ canvas: endCanvas, delay: 1000 }) // 1 second pause at end
        URL.revokeObjectURL(endImg.src)

        // Restore original content
        textElement.innerHTML = originalHTML

        if (onProgress) {
            onProgress(0.85) // 85% - starting encoding
        }

        // Use gifenc to encode - it's fast and reliable
        // Collect all frame image data to create a global palette
        const allImageData: Uint8ClampedArray[] = []
        for (const { canvas } of frames) {
            const ctx = canvas.getContext('2d')!
            const imageData = ctx.getImageData(0, 0, width, height)
            allImageData.push(imageData.data)
        }

        // Combine all frames to create optimal palette
        const combinedData = new Uint8ClampedArray(allImageData.length * width * height * 4)
        let offset = 0
        for (const data of allImageData) {
            combinedData.set(data, offset)
            offset += data.length
        }

        // Create optimized palette (256 colors for GIF) from all frames
        const palette = quantize(combinedData, 256)

        if (onProgress) {
            onProgress(0.90) // 90% - palette created
        }

        // Create GIF encoder
        const gif = GIFEncoder()

        // Encode all frames
        for (let i = 0; i < frames.length; i++) {
            const { canvas, delay } = frames[i]
            const ctx = canvas.getContext('2d')!
            const imageData = ctx.getImageData(0, 0, width, height)
            
            // Apply palette to get indexed bitmap
            const indexed = applyPalette(imageData.data, palette)
            
            // Write frame to GIF (delay in milliseconds, first frame sets global palette and repeat)
            gif.writeFrame(indexed, width, height, {
                palette: i === 0 ? palette : undefined, // Global palette on first frame
                delay: delay, // Delay in milliseconds
                first: i === 0, // Mark first frame
                repeat: i === 0 ? (loop ? 0 : -1) : undefined, // Set repeat on first frame only
            })

            if (onProgress) {
                onProgress(0.90 + (i / frames.length) * 0.09) // 90-99% encoding frames
            }
        }

        // Finish encoding
        gif.finish()

        if (onProgress) {
            onProgress(1.0) // 100% - complete
        }

        // Get the binary GIF data
        const gifBytes = gif.bytes()
        
        // Convert to blob and download
        // Create a new ArrayBuffer to ensure compatibility
        const buffer = new ArrayBuffer(gifBytes.byteLength)
        const view = new Uint8Array(buffer)
        view.set(gifBytes)
        const blob = new Blob([buffer], { type: 'image/gif' })
        downloadBlob(blob, generateFilename(username, 'gif'))
    } catch (error) {
        // Restore original content on error
        if (textElement) {
            textElement.innerHTML = originalHTML
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
