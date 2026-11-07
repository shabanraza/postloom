// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Slide, THEMES } from '../CarouselMaker'

const props = { text: 'Hello', name: 'Ada', handle: 'ada', theme: THEMES.dark, accent: '#c9a96e' }

afterEach(() => cleanup())

describe('carousel slide footer', () => {
  it('shows "Swipe" on every slide but the last', () => {
    const { container } = render(<Slide {...props} index={0} total={3} />)
    expect(container.textContent).toContain('Swipe')
  })

  it('has no Postloom credit on the last slide (the tool promises no watermark)', () => {
    const { container } = render(<Slide {...props} index={2} total={3} />)
    expect(container.textContent?.toLowerCase()).not.toContain('postloom')
    expect(container.textContent).not.toContain('Swipe')
  })
})
