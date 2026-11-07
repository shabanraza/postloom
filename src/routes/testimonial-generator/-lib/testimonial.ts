/** Pure helpers for the testimonial generator (no DOM, unit tested). */

export interface Testimonial {
  id: string
  text: string
  name: string
  /** X handle without "@", or a role such as "Founder, Acme" */
  handle: string
  avatarUrl?: string
  /** Link back to the original post, used in the embed */
  sourceUrl?: string
}

export interface CardSize {
  id: 'square' | 'portrait' | 'landscape'
  label: string
  width: number
  height: number
}

export const CARD_SIZES: ReadonlyArray<CardSize> = [
  { id: 'square', label: 'Square', width: 1080, height: 1080 },
  { id: 'portrait', label: 'Portrait', width: 1080, height: 1350 },
  { id: 'landscape', label: 'Landscape', width: 1200, height: 675 },
]

const TWEET_URL_RE = /https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/(\w{1,15})\/status(?:es)?\/(\d+)/gi

/** Every unique tweet URL in a block of text, normalised to x.com, in order of appearance. */
export function parseTweetUrls(input: string): Array<string> {
  const seen = new Set<string>()
  const urls: Array<string> = []
  for (const match of input.matchAll(TWEET_URL_RE)) {
    const [, user, id] = match
    if (seen.has(id)) continue
    seen.add(id)
    urls.push(`https://x.com/${user}/status/${id}`)
  }
  return urls
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
}

/**
 * Make tweet text read like a quote: decode HTML entities, drop trailing t.co
 * links (media and quote-tweet links) and leading reply mentions.
 */
export function cleanTweetText(text: string): string {
  return text
    .replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (e) => ENTITIES[e])
    .replace(/(?:\s*https?:\/\/t\.co\/\w+)+\s*$/g, '')
    .replace(/^(?:@\w{1,15}\s+)+/, '')
    .trim()
}

/** Quote font size in px for a card, shrinking as the text gets longer. */
export function quoteFontSize(text: string, size: CardSize): number {
  const base = size.id === 'landscape' ? 46 : 64
  const len = text.length
  if (len <= 80) return base
  if (len <= 160) return Math.round(base * 0.82)
  if (len <= 240) return Math.round(base * 0.68)
  return Math.round(base * 0.56)
}

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export interface WallTheme {
  background: string
  card: string
  text: string
  muted: string
  border: string
}

/** Only http(s) links make it into the embed. */
function safeUrl(url: string | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null
  } catch {
    return null
  }
}

/**
 * A self-contained "wall of love" snippet: plain HTML with inline styles and
 * no scripts, so it can be pasted into any site builder.
 */
export function buildWallEmbed(
  items: ReadonlyArray<Testimonial>,
  opts: { theme: WallTheme; accent: string; title?: string },
): string {
  const { theme, accent, title } = opts
  const cards = items
    .map((t) => {
      const link = safeUrl(t.sourceUrl)
      const handle = t.handle ? escapeHtml(t.handle.startsWith('@') || t.handle.includes(' ') ? t.handle : `@${t.handle}`) : ''
      const author =
        `<div style="display:flex;align-items:center;gap:10px;margin-top:16px">` +
        `<span style="width:36px;height:36px;border-radius:50%;background:${accent};color:#1c1b18;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${escapeHtml(initialsOf(t.name))}</span>` +
        `<span style="line-height:1.3"><strong style="display:block;font-size:14px">${escapeHtml(t.name)}</strong>` +
        (handle ? `<span style="font-size:13px;color:${theme.muted}">${handle}</span>` : '') +
        `</span></div>`
      const body =
        `<p style="margin:0;font-size:15px;line-height:1.55;white-space:pre-wrap">${escapeHtml(t.text)}</p>` + author
      const cardStyle = `display:block;break-inside:avoid;margin:0 0 16px;padding:20px;border-radius:14px;background:${theme.card};border:1px solid ${theme.border};color:${theme.text};text-decoration:none`
      return link
        ? `  <a href="${escapeHtml(link)}" target="_blank" rel="noopener" style="${cardStyle}">${body}</a>`
        : `  <div style="${cardStyle}">${body}</div>`
    })
    .join('\n')

  const heading = title
    ? `  <h2 style="margin:0 0 24px;font-size:28px;text-align:center;color:${theme.text}">${escapeHtml(title)}</h2>\n`
    : ''

  return (
    `<!-- Wall of love made with postloom.studio -->\n` +
    `<section style="padding:32px 16px;background:${theme.background};font-family:Inter,system-ui,-apple-system,'Segoe UI',sans-serif">\n` +
    heading +
    ` <div style="column-width:280px;column-gap:16px;max-width:1080px;margin:0 auto">\n` +
    cards +
    `\n </div>\n</section>`
  )
}

/**
 * Star ratings are off by default: a tweet or quote is not a rating, and showing
 * stars nobody gave can read as a fake review (FTC rule on consumer reviews, 2024).
 */
export const DEFAULT_SHOW_STARS = false
