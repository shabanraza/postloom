/** Slide size shared by Instagram (4:5 portrait) and LinkedIn document posts. */
export const SLIDE_WIDTH = 1080
export const SLIDE_HEIGHT = 1350

/** Longest text that still fits on one slide at the smallest font size. */
export const MAX_SLIDE_CHARS = 420

/**
 * Split pasted text into slides.
 * - A line with only `---` always starts a new slide.
 * - Otherwise blank lines separate slides.
 * - Thread markers such as "1/", "2/10" or "1." at the start of a slide are removed.
 * - A paragraph that is too long is split on sentence boundaries.
 */
export function splitIntoSlides(raw: string): Array<string> {
  const text = raw.replace(/\r\n/g, '\n').trim()
  if (!text) return []

  const blocks = text.includes('\n---')
    ? text.split(/\n\s*---\s*\n/)
    : text.split(/\n\s*\n/)

  const slides: Array<string> = []
  for (const block of blocks) {
    const cleaned = block
      .trim()
      .replace(/^\(?\d{1,2}\s*(\/\s*\d{0,2})?[.)/]?\s+/, '')
      .trim()
    if (!cleaned) continue
    slides.push(...splitLong(cleaned))
  }
  return slides
}

function splitLong(text: string): Array<string> {
  if (text.length <= MAX_SLIDE_CHARS) return [text]
  const sentences = text.match(/[^.!?\n]+[.!?]*\s*/g) ?? [text]
  const parts: Array<string> = []
  let current = ''
  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_SLIDE_CHARS && current) {
      parts.push(current.trim())
      current = ''
    }
    current += sentence
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

/** Font size that keeps a slide's text inside the safe area. */
export function fontSizeFor(text: string): number {
  const n = text.length
  if (n < 60) return 76
  if (n < 120) return 64
  if (n < 200) return 54
  if (n < 300) return 46
  return 40
}

/** Minimal PDF writer: one JPEG image per page, page size = image size. */
export function buildPdfFromJpegs(
  pages: Array<{ data: Uint8Array; width: number; height: number }>,
): Blob {
  const encoder = new TextEncoder()
  const chunks: Array<Uint8Array> = []
  const offsets: Array<number> = []
  let length = 0

  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === 'string' ? encoder.encode(part) : part
    chunks.push(bytes)
    length += bytes.length
  }
  const startObject = (id: number) => {
    offsets[id] = length
    push(`${id} 0 obj\n`)
  }

  // Object ids: 1 catalog, 2 pages, then per page: page, image, content
  const pageIds = pages.map((_, i) => 3 + i * 3)
  const totalObjects = 2 + pages.length * 3

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')

  startObject(1)
  push('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')

  startObject(2)
  push(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>\nendobj\n`,
  )

  pages.forEach((page, i) => {
    const pageId = pageIds[i]
    const imageId = pageId + 1
    const contentId = pageId + 2
    const { width: w, height: h } = page

    startObject(pageId)
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im${i} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`,
    )

    startObject(imageId)
    push(
      `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.data.length} >>\nstream\n`,
    )
    push(page.data)
    push('\nendstream\nendobj\n')

    const content = `q ${w} 0 0 ${h} 0 0 cm /Im${i} Do Q`
    startObject(contentId)
    push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`)
  })

  const xrefOffset = length
  let xref = `xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`
  for (let id = 1; id <= totalObjects; id++) {
    xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  push(xref)
  push(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`)

  return new Blob(chunks as Array<BlobPart>, { type: 'application/pdf' })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
