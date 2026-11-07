import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackCtaClick, trackExportComplete, trackToolOpen } from './analytics'

describe('Clarity mirroring', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends events, tags and an upgrade for exports', () => {
    const clarity = vi.fn()
    vi.stubGlobal('window', { clarity })
    trackExportComplete('carousel', 'pdf', { slides: 5 })
    expect(clarity.mock.calls).toEqual([
      ['event', 'export_complete'],
      ['set', 'tool', 'carousel'],
      ['set', 'format', 'pdf'],
      ['upgrade', 'export_complete'],
    ])
  })

  it('does not upgrade other events', () => {
    const clarity = vi.fn()
    vi.stubGlobal('window', { clarity })
    trackToolOpen()
    trackCtaClick('hero_start', 'home')
    expect(clarity.mock.calls.some(([cmd]) => cmd === 'upgrade')).toBe(false)
    expect(clarity).toHaveBeenCalledWith('set', 'cta_name', 'hero_start')
  })

  it('does nothing before consent, when clarity is not loaded', () => {
    vi.stubGlobal('window', {})
    expect(() => trackExportComplete('tweet_card', 'png')).not.toThrow()
  })
})
