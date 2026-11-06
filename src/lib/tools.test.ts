import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LANDING_PAGES, SITE_URL, TOOLS } from './tools'

const publicFile = (name: string) =>
  readFileSync(resolve(__dirname, '../../public', name), 'utf8')

describe('tools registry', () => {
  const pages = [...TOOLS, ...LANDING_PAGES]

  it('lists every tool and landing page in sitemap.xml', () => {
    const sitemap = publicFile('sitemap.xml')
    for (const page of pages) expect(sitemap).toContain(`<loc>${SITE_URL}${page.path}</loc>`)
  })

  it('lists every tool and landing page in llms.txt', () => {
    const llms = publicFile('llms.txt')
    for (const page of pages) expect(llms).toContain(`${SITE_URL}${page.path}`)
  })

  it('points every landing page at a real tool', () => {
    const toolPaths = new Set(TOOLS.map((t) => t.path))
    for (const page of LANDING_PAGES) expect(toolPaths.has(page.tool)).toBe(true)
  })

  it('has no duplicate paths', () => {
    expect(new Set(pages.map((p) => p.path)).size).toBe(pages.length)
  })
})
