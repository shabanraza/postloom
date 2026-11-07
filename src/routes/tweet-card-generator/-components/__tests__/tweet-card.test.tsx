// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { useTweetStudioStore } from '../../-state'
import { TweetCard } from '../TweetCard'
import { TweetTextSection } from '../sections/TweetTextSection'

function setMetrics(views: number) {
  const { tweet } = useTweetStudioStore.getState()
  useTweetStudioStore.setState({
    tweet: {
      ...tweet,
      content: { ...tweet.content, showTimestamp: true },
      metrics: { ...tweet.metrics, showMetrics: true, views },
    },
  })
}

afterEach(() => cleanup())

describe('TweetCard views in the timestamp line', () => {
  it('shows the count and label when the post has views', () => {
    setMetrics(1300)
    const { container } = render(<TweetCard />)
    expect(container.textContent).toContain('1.3K Views')
  })

  it('leaves out "Views" when there is no count (e.g. an imported old tweet)', () => {
    setMetrics(0)
    const { container } = render(<TweetCard />)
    expect(container.textContent).not.toContain('Views')
  })
})

describe('TweetTextSection character limit', () => {
  it.each([
    ['twitter', 280],
    ['threads', 500],
    ['linkedin', 3000],
  ] as const)('allows %s posts up to %i characters', (platform, limit) => {
    useTweetStudioStore.getState().setPlatform(platform)
    render(<TweetTextSection />)
    expect(screen.getByPlaceholderText("What's happening?")).toHaveProperty('maxLength', limit)
  })
})
