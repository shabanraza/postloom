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

describe('buildZip', () => {
  const enc = new TextEncoder()
  const bytesOf = async (blob: Blob) => new Uint8Array(await blob.arrayBuffer())
  const u32 = (b: Uint8Array, at: number) => new DataView(b.buffer, b.byteOffset).getUint32(at, true)
  const u16 = (b: Uint8Array, at: number) => new DataView(b.buffer, b.byteOffset).getUint16(at, true)

  it('computes the standard CRC-32', async () => {
    const { crc32 } = await import('./carousel')
    expect(crc32(enc.encode('hello'))).toBe(0x3610a686)
    expect(crc32(new Uint8Array())).toBe(0)
  })

  it('stores each file with a local header, central directory and end record', async () => {
    const { buildZip } = await import('./carousel')
    const zip = await bytesOf(
      buildZip([
        { name: 'a-1.png', data: enc.encode('hello') },
        { name: 'a-2.png', data: enc.encode('world!') },
      ]),
    )
    expect(u32(zip, 0)).toBe(0x04034b50) // first local file header
    expect(u32(zip, 14)).toBe(0x3610a686) // its CRC
    const date = u16(zip, 12) // DOS date: day 1-31, month 1-12, so unzip apps show a real date
    expect(date & 0x1f).toBeGreaterThan(0)
    expect((date >> 5) & 0x0f).toBeGreaterThan(0)
    expect(u32(zip, 18)).toBe(5) // compressed size (stored)
    expect(new TextDecoder().decode(zip.slice(30, 37))).toBe('a-1.png')
    expect(new TextDecoder().decode(zip.slice(37, 42))).toBe('hello')

    const end = zip.length - 22
    expect(u32(zip, end)).toBe(0x06054b50)
    expect(u16(zip, end + 10)).toBe(2) // total entries
    const cdOffset = u32(zip, end + 16)
    expect(u32(zip, cdOffset)).toBe(0x02014b50)
    expect(u32(zip, end + 12)).toBe(end - cdOffset) // central directory size
  })
})
