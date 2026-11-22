// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => ({
    texts: [] as string[],
    writeFrame: vi.fn(),
    destroy: vi.fn(),
    failAt: -1,
    element: null as HTMLElement | null,
}))

vi.mock('modern-screenshot', () => ({
    domToPng: vi.fn(),
    createContext: vi.fn(async () => ({ ctx: true })),
    destroyContext: h.destroy,
    domToCanvas: vi.fn(async () => {
        const text = h.element!.querySelector('[data-tweet-text]')!.textContent ?? ''
        h.texts.push(text)
        if (h.failAt === h.texts.length) throw new Error('capture failed')
        return {
            width: 40,
            height: 20,
            getContext: () => ({
                getImageData: () => ({ data: new Uint8ClampedArray(40 * 20 * 4).fill(h.texts.length * 10) }),
            }),
        }
    }),
}))

vi.mock('gifenc', async (orig) => {
    const actual = await orig<typeof import('gifenc')>()
    return {
        ...actual,
        GIFEncoder: () => {
            const enc = actual.GIFEncoder()
            const write = enc.writeFrame.bind(enc)
            enc.writeFrame = ((...args: Parameters<typeof write>) => {
                h.writeFrame(...args)
                return write(...args)
            }) as typeof enc.writeFrame
            return enc
        },
    }
})

import { exportAsGif } from './index'

function setup() {
    const element = document.createElement('div')
    const textEl = document.createElement('p')
    textEl.setAttribute('data-tweet-text', '')
    const child = document.createElement('span')
    child.textContent = 'original'
    textEl.append(child)
    element.append(textEl)
    document.body.append(element)
    h.element = element
    return { element, textEl, child }
}

const opts = (onProgress?: (p: number) => void) => ({
    text: 'hello world, this is a test',
    width: 1600,
    height: 900,
    speed: 50,
    fps: 20,
    loop: true,
    onProgress,
})

describe('exportAsGif', () => {
    beforeEach(() => {
        h.texts = []
        h.failAt = -1
        h.writeFrame.mockClear()
        h.destroy.mockClear()
        URL.createObjectURL = vi.fn(() => 'blob:x')
        URL.revokeObjectURL = vi.fn()
        HTMLAnchorElement.prototype.click = vi.fn()
    })

    it('ends on the full text with a 1s hold, reports progress and real size', async () => {
        const { element, textEl, child } = setup()
        const progress: number[] = []
        const res = await exportAsGif(element, 'me', opts((p) => progress.push(p)))

        const last = h.texts[h.texts.length - 1]
        expect(last).toBe('hello world, this is a test')
        expect(last).not.toContain('|')
        expect(h.texts[0]).toBe('|')
        expect(h.writeFrame).toHaveBeenCalledTimes(h.texts.length)
        const calls = h.writeFrame.mock.calls
        expect(calls[calls.length - 1][3].delay).toBe(1000)
        expect(calls[0][3].repeat).toBe(0)

        for (let i = 1; i < progress.length; i++) expect(progress[i]).toBeGreaterThanOrEqual(progress[i - 1])
        expect(progress[progress.length - 1]).toBe(1)

        expect(res.width).toBe(40)
        expect(res.height).toBe(20)
        expect(h.destroy).toHaveBeenCalledTimes(1)
        expect(textEl.childNodes[0]).toBe(child)
        expect(textEl.childNodes).toHaveLength(1)
    })

    it('cleans up and restores the original nodes when capture fails', async () => {
        const { element, textEl, child } = setup()
        h.failAt = 3
        await expect(exportAsGif(element, 'me', opts())).rejects.toThrow('capture failed')
        expect(h.destroy).toHaveBeenCalledTimes(1)
        expect(textEl.childNodes[0]).toBe(child)
        expect(textEl.childNodes).toHaveLength(1)
    })
})
