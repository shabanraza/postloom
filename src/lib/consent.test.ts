import { describe, expect, it } from 'vitest'
import { needsOptIn } from './consent'

describe('needsOptIn', () => {
  it('requires opt-in in the EU, EEA, UK and Switzerland', () => {
    for (const c of ['DE', 'FR', 'IE', 'NO', 'IS', 'GB', 'CH', 'de']) expect(needsOptIn(c)).toBe(true)
  })
  it('uses notice and opt-out elsewhere', () => {
    for (const c of ['US', 'IN', 'BR', 'CA', 'AU']) expect(needsOptIn(c)).toBe(false)
  })
  it('takes the strict route when the location is unknown', () => {
    for (const c of [undefined, null, '', 'XX', 'T1']) expect(needsOptIn(c)).toBe(true)
  })
})
