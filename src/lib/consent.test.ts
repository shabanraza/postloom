import { describe, expect, it } from 'vitest'
import { needsOptIn } from './consent'

describe('needsOptIn', () => {
  it('requires opt-in in the EU, EEA, UK and Switzerland', () => {
    for (const c of ['DE', 'FR', 'IE', 'NO', 'IS', 'GB', 'CH', 'de']) expect(needsOptIn(c)).toBe(true)
  })
  it('requires opt-in in Quebec', () => {
    expect(needsOptIn('CA', 'QC')).toBe(true)
    expect(needsOptIn('ca', 'qc')).toBe(true)
  })
  it('uses notice and opt-out in the US, the rest of Canada and other countries', () => {
    expect(needsOptIn('US', 'CA')).toBe(false) // California
    expect(needsOptIn('US')).toBe(false)
    expect(needsOptIn('CA', 'ON')).toBe(false)
    expect(needsOptIn('CA', 'BC')).toBe(false)
    for (const c of ['AU', 'NZ', 'IN', 'BR']) expect(needsOptIn(c)).toBe(false)
  })
  it('takes the strict route when the location is unknown', () => {
    for (const c of [undefined, null, '', 'XX', 'T1']) expect(needsOptIn(c)).toBe(true)
    expect(needsOptIn('CA')).toBe(true) // province unknown, could be Quebec
  })
})
