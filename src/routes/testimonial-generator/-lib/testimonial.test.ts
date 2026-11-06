import { describe, expect, it } from 'vitest'
import {
  CARD_SIZES,
  buildWallEmbed,
  cleanTweetText,
  escapeHtml,
  initialsOf,
  parseTweetUrls,
  quoteFontSize,
} from './testimonial'

const theme = { background: '#fff', card: '#fff', text: '#000', muted: '#666', border: '#eee' }

describe('parseTweetUrls', () => {
  it('finds x.com and twitter.com links, dedupes by id and normalises', () => {
    const input = `Loved by:
https://twitter.com/jack/status/20?s=20
https://x.com/sama/status/1234567890 and again https://mobile.twitter.com/sama/status/1234567890
not a tweet https://x.com/home`
    expect(parseTweetUrls(input)).toEqual([
      'https://x.com/jack/status/20',
      'https://x.com/sama/status/1234567890',
    ])
  })

  it('returns nothing for text without tweet links', () => {
    expect(parseTweetUrls('hello world')).toEqual([])
  })
})

describe('cleanTweetText', () => {
  it('decodes entities, strips trailing t.co links and reply mentions', () => {
    expect(cleanTweetText('@postloom @team This is great &amp; fast &lt;3 https://t.co/abc https://t.co/def')).toBe(
      'This is great & fast <3',
    )
  })

  it('keeps mentions and links in the middle of the text', () => {
    expect(cleanTweetText('Thanks @postloom, see https://t.co/x1 for more!')).toBe(
      'Thanks @postloom, see https://t.co/x1 for more!',
    )
  })
})

describe('quoteFontSize', () => {
  it('shrinks as text grows and is smaller on landscape', () => {
    const square = CARD_SIZES[0]
    const landscape = CARD_SIZES[2]
    expect(quoteFontSize('short', square)).toBeGreaterThan(quoteFontSize('x'.repeat(300), square))
    expect(quoteFontSize('short', landscape)).toBeLessThan(quoteFontSize('short', square))
  })
})

describe('initialsOf', () => {
  it('uses up to two initials', () => {
    expect(initialsOf('Maya Lin Chen')).toBe('ML')
    expect(initialsOf('')).toBe('?')
  })
})

describe('buildWallEmbed', () => {
  it('escapes user content and has no scripts', () => {
    const html = buildWallEmbed(
      [{ id: '1', text: '<script>alert(1)</script>', name: 'A "B"', handle: 'ab' }],
      { theme, accent: '#4a6b57', title: 'Loved by <makers>' },
    )
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('A &quot;B&quot;')
    expect(html).toContain('@ab')
    expect(html).toContain('Loved by &lt;makers&gt;')
  })

  it('links only to http(s) sources', () => {
    const html = buildWallEmbed(
      [
        { id: '1', text: 'ok', name: 'A', handle: '', sourceUrl: 'https://x.com/a/status/1' },
        { id: '2', text: 'bad', name: 'B', handle: '', sourceUrl: 'javascript:alert(1)' },
      ],
      { theme, accent: '#000' },
    )
    expect(html).toContain('href="https://x.com/a/status/1"')
    expect(html).not.toContain('javascript:')
  })

  it('keeps a role such as "Founder, Acme" without adding @', () => {
    const html = buildWallEmbed([{ id: '1', text: 'x', name: 'A', handle: 'Founder, Acme' }], {
      theme,
      accent: '#000',
    })
    expect(html).toContain('Founder, Acme')
    expect(html).not.toContain('@Founder')
  })

  it('escapeHtml handles quotes', () => {
    expect(escapeHtml(`'"&`)).toBe('&#39;&quot;&amp;')
  })
})
