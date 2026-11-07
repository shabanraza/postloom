// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { formatNumber } from './-utils'

describe('formatNumber', () => {
  it('shows nothing for zero or missing counts', () => {
    expect(formatNumber(0)).toBe('')
    expect(formatNumber(Number.NaN)).toBe('')
  })

  it('keeps small numbers as they are', () => {
    expect(formatNumber(7)).toBe('7')
    expect(formatNumber(999)).toBe('999')
  })

  it('drops a trailing .0 the way X does', () => {
    expect(formatNumber(1000)).toBe('1K')
    expect(formatNumber(2_000_000)).toBe('2M')
    expect(formatNumber(1300)).toBe('1.3K')
  })

  it('rolls over to the next unit instead of showing 1000.0K', () => {
    expect(formatNumber(999_950)).toBe('1M')
    expect(formatNumber(999_999)).toBe('1M')
  })
})

import { fitWithin, formatBytes, isTypingTarget, logoPlacement } from './-utils'

describe('formatBytes', () => {
  it('reads like a file manager', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(245_760)).toBe('240 KB')
    expect(formatBytes(1_572_864)).toBe('1.5 MB')
  })
})

describe('fitWithin', () => {
  it('shrinks big images and keeps the shape', () => {
    expect(fitWithin(1000, 500, 400)).toEqual({ width: 400, height: 200 })
    expect(fitWithin(200, 100, 400)).toEqual({ width: 200, height: 100 })
  })
})

describe('logoPlacement', () => {
  it('puts the logo in the chosen corner with a margin', () => {
    const box = logoPlacement(1600, 900, { position: 'bottom-right', size: 10 })
    expect(box).toEqual({ size: 90, right: 36, bottom: 36 })
  })

  it('is hidden when no corner is chosen', () => {
    expect(logoPlacement(1600, 900, { position: 'none', size: 10 })).toBeNull()
  })
})

describe('isTypingTarget', () => {
  it('knows when the user is typing', () => {
    expect(isTypingTarget(document.createElement('input'))).toBe(true)
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true)
    expect(isTypingTarget(document.createElement('button'))).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})

import { vi } from 'vitest'
import { waitForPaint } from './-utils'

describe('waitForPaint', () => {
  it('still finishes in a background tab, where animation frames never fire', async () => {
    vi.useFakeTimers()
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)
    let done = false
    waitForPaint().then(() => { done = true })
    await vi.advanceTimersByTimeAsync(100)
    expect(done).toBe(true)
    raf.mockRestore()
    vi.useRealTimers()
  })
})
