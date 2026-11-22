import { fitWithin } from '../-utils'

/** Longest side of an exported GIF in px. Bigger GIFs are slow to build and huge to share. */
export const GIF_MAX_SIDE = 800

/** Max pixels used to build the shared 256-color palette. */
export const PALETTE_SAMPLE_PIXELS = 250_000

/** Output size of the GIF plus the render scale that gets the card there. */
export function gifOutputSize(width: number, height: number, maxSide = GIF_MAX_SIDE) {
    const fitted = fitWithin(width, height, maxSide)
    const scale = Math.max(1, width, height) > maxSide ? maxSide / Math.max(width, height) : 1
    return { ...fitted, scale }
}

/** Typewriter step so a GIF has about 20 frames (never more than 21 with the hold frame). */
export function frameStepFor(length: number): number {
    return Math.max(1, Math.ceil(length / 20))
}

/** Character counts shown by each typewriter frame: 0, step, 2*step ... ending on `length`. */
export function frameIndexes(length: number, step: number): number[] {
    const s = Math.max(1, Math.floor(step))
    const out: number[] = []
    for (let i = 0; i < length; i += s) out.push(i)
    out.push(Math.max(0, length))
    return out
}

/**
 * Strided pixel sample across all frames (RGBA data), at most `maxPixels` pixels.
 * Quantizing this instead of every pixel of every frame keeps palette building fast.
 */
export function samplePalettePixels(
    frames: Uint8ClampedArray[],
    maxPixels = PALETTE_SAMPLE_PIXELS
): Uint8ClampedArray {
    if (frames.length === 0) return new Uint8ClampedArray(0)
    const budget = Math.max(1, Math.floor(maxPixels / frames.length))
    const parts: Uint8ClampedArray[] = []
    let total = 0
    for (let n = 0; n < frames.length; n++) {
        const data = frames[n]
        const pixels = Math.floor(data.length / 4)
        const stride = Math.max(1, Math.ceil(pixels / budget))
        const start = n % stride // vary per frame so a stride matching the row width doesn't pick the same columns
        const count = Math.max(0, Math.ceil((pixels - start) / stride))
        const part = new Uint8ClampedArray(count * 4)
        for (let k = 0, p = start; p < pixels; p += stride, k++) {
            part.set(data.subarray(p * 4, p * 4 + 4), k * 4)
        }
        parts.push(part)
        total += part.length
    }
    const out = new Uint8ClampedArray(total)
    let offset = 0
    for (const part of parts) {
        out.set(part, offset)
        offset += part.length
    }
    return out
}
