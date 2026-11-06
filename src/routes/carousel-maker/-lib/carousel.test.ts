import { describe, expect, it } from 'vitest'
import { MAX_SLIDE_CHARS, buildPdfFromJpegs, splitIntoSlides } from './carousel'

describe('splitIntoSlides', () => {
  it('splits on blank lines and strips thread numbers', () => {
    expect(splitIntoSlides('1/ First point\n\n2/10 Second point\n\n3. Third')).toEqual([
      'First point',
      'Second point',
      'Third',
    ])
  })

  it('uses --- separators when present, keeping blank lines inside a slide', () => {
    expect(splitIntoSlides('Title\n\nSubtitle\n---\nNext')).toEqual(['Title\n\nSubtitle', 'Next'])
  })

  it('splits text that is too long into several slides', () => {
    const long = 'This is a sentence that is fairly long. '.repeat(20)
    const slides = splitIntoSlides(long)
    expect(slides.length).toBeGreaterThan(1)
    for (const slide of slides) expect(slide.length).toBeLessThanOrEqual(MAX_SLIDE_CHARS)
  })

  it('returns no slides for empty input', () => {
    expect(splitIntoSlides('   \n\n ')).toEqual([])
  })
})

describe('buildPdfFromJpegs', () => {
  it('writes one page per image with a valid header, xref and trailer', async () => {
    const fake = new Uint8Array([0xff, 0xd8, 0xff, 0xd9])
    const blob = buildPdfFromJpegs([
      { data: fake, width: 1080, height: 1350 },
      { data: fake, width: 1080, height: 1350 },
    ])
    const text = new TextDecoder('latin1').decode(new Uint8Array(await blob.arrayBuffer()))
    expect(text.startsWith('%PDF-1.4')).toBe(true)
    expect(text).toContain('/Count 2')
    expect(text.match(/\/Type \/Page /g)).toHaveLength(2)
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true)
    const startxref = Number(text.match(/startxref\n(\d+)/)![1])
    expect(text.slice(startxref, startxref + 4)).toBe('xref')
  })
})
