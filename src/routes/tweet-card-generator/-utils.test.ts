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
