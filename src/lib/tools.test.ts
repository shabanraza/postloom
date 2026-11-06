import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SITE_URL, TOOLS } from './tools'

const publicFile = (name: string) =>
  readFileSync(resolve(__dirname, '../../public', name), 'utf8')

describe('tools registry', () => {
  it('lists every tool in sitemap.xml', () => {
    const sitemap = publicFile('sitemap.xml')
    for (const tool of TOOLS) expect(sitemap).toContain(`<loc>${SITE_URL}${tool.path}</loc>`)
  })

  it('lists every tool in llms.txt', () => {
    const llms = publicFile('llms.txt')
    for (const tool of TOOLS) expect(llms).toContain(`${SITE_URL}${tool.path}`)
  })
})
