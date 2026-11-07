import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')

describe('global styles', () => {
  it('shows the hand cursor on everything clickable (Tailwind v4 dropped it for buttons)', () => {
    const rule = css.match(/([^{}]+)\{\s*cursor:\s*pointer;?\s*\}/)
    expect(rule).not.toBeNull()
    for (const sel of ['button:not(:disabled)', '[role="button"]', '[role="menuitem"]', '[role="option"]', 'select', 'summary', 'label[for]']) {
      expect(rule![1]).toContain(sel)
    }
  })

  it('shows the not-allowed cursor on disabled buttons', () => {
    expect(css).toMatch(/button:disabled[^{]*\{\s*cursor:\s*not-allowed/)
  })
})

import { readdirSync } from 'node:fs'

describe('ui components', () => {
  it('do not force the arrow cursor on clickable menu and list items', () => {
    const dir = new URL('./components/ui/', import.meta.url)
    const offenders = readdirSync(dir).filter((f) => readFileSync(new URL(f, dir), 'utf8').includes('cursor-default'))
    expect(offenders).toEqual([])
  })
})
