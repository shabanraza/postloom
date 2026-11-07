import { describe, expect, it } from 'vitest'
import { textLimitFor } from './-constants'

describe('textLimitFor', () => {
  it('matches each platform\'s post length', () => {
    expect(textLimitFor('twitter')).toBe(280)
    expect(textLimitFor('threads')).toBe(500)
    expect(textLimitFor('linkedin')).toBe(3000)
  })
})
