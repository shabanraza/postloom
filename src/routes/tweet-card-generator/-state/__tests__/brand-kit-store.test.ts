// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { useTweetStudioStore } from '../tweet-studio-store'

describe('brand kit in the store', () => {
  it('saves brand kits so added colours survive a reload', () => {
    const { partialize } = useTweetStudioStore.persist.getOptions()
    const saved = partialize!(useTweetStudioStore.getState()) as Record<string, unknown>
    expect(saved).toHaveProperty('brandKits')
    expect(saved).toHaveProperty('activeBrandKitId')
  })

  it('applying a brand colour switches a gradient background to that solid colour', () => {
    const { design } = useTweetStudioStore.getState()
    useTweetStudioStore.setState({ design: { ...design, backgroundType: 'gradient' } })
    useTweetStudioStore.getState().applyBrandColor('#4a6b57')
    const next = useTweetStudioStore.getState().design
    expect(next.backgroundType).toBe('solid')
    expect(next.backgroundColor).toBe('#4a6b57')
  })
})
