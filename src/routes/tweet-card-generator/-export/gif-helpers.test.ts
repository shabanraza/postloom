import { describe, expect, it } from 'vitest'
import { quantize } from 'gifenc'
import { GIF_MAX_SIDE, gifOutputSize, frameIndexes, frameStepFor, samplePalettePixels } from './gif-helpers'

describe('gifOutputSize', () => {
    it('caps the longest side at 800 and keeps the aspect ratio', () => {
        expect(gifOutputSize(1600, 900)).toEqual({ width: 800, height: 450, scale: 0.5 })
        expect(gifOutputSize(900, 1600)).toEqual({ width: 450, height: 800, scale: 0.5 })
    })
    it('never upscales small cards', () => {
        expect(gifOutputSize(600, 400)).toEqual({ width: 600, height: 400, scale: 1 })
        expect(GIF_MAX_SIDE).toBe(800)
    })
})

describe('frameIndexes', () => {
    it('steps through the text and ends on the full length', () => {
        expect(frameIndexes(10, 5)).toEqual([0, 5, 10])
        expect(frameIndexes(10, 4)).toEqual([0, 4, 8, 10])
    })
    it('handles empty text', () => {
        expect(frameIndexes(0, 1)).toEqual([0])
    })
})

describe('samplePalettePixels', () => {
    const frame = (n: number, v: number) => new Uint8ClampedArray(n * 4).fill(v)

    it('returns every pixel when under the cap', () => {
        const out = samplePalettePixels([frame(10, 1), frame(10, 2)], 1000)
        expect(out.length).toBe(20 * 4)
    })
    it('caps the sample size and draws from every frame', () => {
        const out = samplePalettePixels([frame(1000, 1), frame(1000, 2), frame(1000, 3)], 300)
        expect(out.length).toBeLessThanOrEqual(300 * 4)
        expect(out.length % 4).toBe(0)
        const seen = new Set(out)
        expect(seen.has(1) && seen.has(2) && seen.has(3)).toBe(true)
    })
    it('keeps RGBA groups intact and picks exact pixels', () => {
        const f = new Uint8ClampedArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        expect(Array.from(samplePalettePixels([f], 2))).toEqual([1, 2, 3, 4, 9, 10, 11, 12])
    })
    it('varies the sampling start per frame', () => {
        const mk = () => new Uint8ClampedArray([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4])
        const out = samplePalettePixels([mk(), mk()], 4) // 2 px per frame, stride 2
        expect(Array.from(out)).toEqual([1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4])
    })
    it('returns a standalone buffer', () => {
        const out = samplePalettePixels([new Uint8ClampedArray(400).fill(9)], 10)
        expect(out.byteOffset).toBe(0)
        expect(out.buffer.byteLength).toBe(out.length)
    })
    it('can be quantized by gifenc', () => {
        const f = new Uint8ClampedArray(4000)
        for (let i = 0; i < f.length; i++) f[i] = (i * 7) % 256
        expect(() => quantize(samplePalettePixels([f, f], 500), 256)).not.toThrow()
    })
})

describe('frameStepFor', () => {
    it('keeps the frame count at about 20', () => {
        for (const len of [1, 10, 49, 100, 280]) {
            expect(frameIndexes(len, frameStepFor(len)).length).toBeLessThanOrEqual(21)
        }
        expect(frameStepFor(0)).toBe(1)
    })
})
