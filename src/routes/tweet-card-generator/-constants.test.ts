import { describe, expect, it } from 'vitest'
import { BRAND_FONT_CHOICES, EXPORT_FORMAT_COPY, isHexColor, textLimitFor } from './-constants'

describe('textLimitFor', () => {
  it('matches each platform\'s post length', () => {
    expect(textLimitFor('twitter')).toBe(280)
    expect(textLimitFor('threads')).toBe(500)
    expect(textLimitFor('linkedin')).toBe(3000)
  })
})

describe('EXPORT_FORMAT_COPY', () => {
  it('tells people what each download is for in plain words', () => {
    expect(EXPORT_FORMAT_COPY.png.title).toBe('Download PNG')
    expect(EXPORT_FORMAT_COPY.gif.title).toBe('Download GIF')
    for (const { hint } of Object.values(EXPORT_FORMAT_COPY)) {
      expect(hint).not.toMatch(/^(still|animated)$/i)
      expect(hint.split(' ').length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('isHexColor', () => {
  it('accepts 3 and 6 digit hex colours', () => {
    expect(isHexColor('#fff')).toBe(true)
    expect(isHexColor('#4A6B57')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isHexColor('4a6b57')).toBe(false)
    expect(isHexColor('#4a6b5')).toBe(false)
    expect(isHexColor('red')).toBe(false)
    expect(isHexColor('')).toBe(false)
  })
})

describe('BRAND_FONT_CHOICES', () => {
  it('offers real typeface choices, not only the system font', () => {
    const families = new Set(BRAND_FONT_CHOICES.map((f) => f.fontFamily))
    expect(families.size).toBeGreaterThanOrEqual(4)
  })
})
