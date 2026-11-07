// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { startHistoryRecording, useTweetStudioStore } from '../tweet-studio-store'

const fresh = useTweetStudioStore.getState()
beforeEach(() => useTweetStudioStore.setState(fresh, true))

describe('brand logo', () => {
  it('stores a logo on a brand kit and can remove it', () => {
    const s = useTweetStudioStore.getState()
    s.setBrandLogo('default', 'data:image/png;base64,AAA')
    expect(useTweetStudioStore.getState().brandKits[0].logoUrl).toBe('data:image/png;base64,AAA')
    useTweetStudioStore.getState().setBrandLogo('default', undefined)
    expect(useTweetStudioStore.getState().brandKits[0].logoUrl).toBeUndefined()
  })

  it('starts hidden and keeps the logo size within 5–30%', () => {
    expect(useTweetStudioStore.getState().logoOverlay.position).toBe('none')
    useTweetStudioStore.getState().setLogoOverlay({ position: 'top-right', size: 90 })
    const o = useTweetStudioStore.getState().logoOverlay
    expect(o.position).toBe('top-right')
    expect(o.size).toBe(30)
  })

  it('saves the logo placement with the other settings', () => {
    const saved = useTweetStudioStore.persist.getOptions().partialize!(useTweetStudioStore.getState()) as Record<string, unknown>
    expect(saved).toHaveProperty('logoOverlay')
    expect(saved).toHaveProperty('savedStyles')
  })
})

describe('several brand kits', () => {
  it('a new kit becomes the active one', () => {
    useTweetStudioStore.getState().createBrandKit('Client B')
    const s = useTweetStudioStore.getState()
    expect(s.brandKits).toHaveLength(2)
    expect(s.activeBrandKitId).toBe(s.brandKits[1].id)
    expect(s.brandKits[1].name).toBe('Client B')
  })

  it('renames a kit', () => {
    useTweetStudioStore.getState().renameBrandKit('default', 'Acme')
    expect(useTweetStudioStore.getState().brandKits[0].name).toBe('Acme')
  })

  it('never deletes the last kit', () => {
    useTweetStudioStore.getState().deleteBrandKit('default')
    expect(useTweetStudioStore.getState().brandKits).toHaveLength(1)
  })
})

describe('saved styles', () => {
  it('saves the whole look and re-applies it later', () => {
    const s = useTweetStudioStore.getState()
    s.setPadding(120)
    s.setTweetTheme('dark')
    s.setCustomSize(1080, 1080)
    s.saveStyle('Launch look')
    const style = useTweetStudioStore.getState().savedStyles[0]
    expect(style.name).toBe('Launch look')

    useTweetStudioStore.getState().setPadding(20)
    useTweetStudioStore.getState().setTweetTheme('light')
    useTweetStudioStore.getState().setCustomSize(1600, 900)
    useTweetStudioStore.getState().applySavedStyle(style.id)

    const after = useTweetStudioStore.getState()
    expect(after.design.padding).toBe(120)
    expect(after.tweet.theme).toBe('dark')
    expect([after.export.width, after.export.height]).toEqual([1080, 1080])
  })

  it('deletes a saved style', () => {
    useTweetStudioStore.getState().saveStyle('Temp')
    const id = useTweetStudioStore.getState().savedStyles[0].id
    useTweetStudioStore.getState().deleteSavedStyle(id)
    expect(useTweetStudioStore.getState().savedStyles).toHaveLength(0)
  })
})

describe('undo and redo', () => {
  afterEach(() => vi.useRealTimers())

  it('records edits automatically so Undo goes back a step', () => {
    vi.useFakeTimers()
    const stop = startHistoryRecording(300)
    useTweetStudioStore.getState().setPadding(40)
    vi.advanceTimersByTime(300)
    useTweetStudioStore.getState().setPadding(90)
    vi.advanceTimersByTime(300)

    useTweetStudioStore.getState().undo()
    expect(useTweetStudioStore.getState().design.padding).toBe(40)
    vi.advanceTimersByTime(300)
    useTweetStudioStore.getState().redo()
    expect(useTweetStudioStore.getState().design.padding).toBe(90)
    stop()
  })

  it('Undo straight after a change (before it is recorded) goes back to just before it', () => {
    vi.useFakeTimers()
    const stop = startHistoryRecording(300)
    useTweetStudioStore.getState().setPadding(40)
    vi.advanceTimersByTime(300)
    useTweetStudioStore.getState().setPadding(90)
    useTweetStudioStore.getState().undo()
    expect(useTweetStudioStore.getState().design.padding).toBe(40)
    stop()
  })

  it('Reset can always be undone, even right after a change', () => {
    vi.useFakeTimers()
    const stop = startHistoryRecording(300)
    useTweetStudioStore.getState().setTweetTheme('dark')
    useTweetStudioStore.getState().reset()
    useTweetStudioStore.getState().undo()
    expect(useTweetStudioStore.getState().tweet.theme).toBe('dark')
    stop()
  })
})
