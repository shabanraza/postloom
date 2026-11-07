// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useTweetStudioStore } from '../../-state'
import { BrandKit } from '../BrandKit'
import { shouldClosePanelOnKey } from '../ExpandablePanel'

// Radix Slider measures itself
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

afterEach(() => cleanup())

describe('BrandKit swatches', () => {
  it('clicking a swatch applies it without opening a delete menu', () => {
    render(<BrandKit />)
    fireEvent.click(screen.getByRole('button', { name: 'Apply Secondary' }))
    expect(useTweetStudioStore.getState().design.backgroundColor).toBe('#4a6b57')
    expect(screen.queryByText('#4a6b57')).toBeNull()
  })

  it('has its own remove button for each colour', () => {
    render(<BrandKit />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Accent' }))
    const kit = useTweetStudioStore.getState().brandKits[0]
    expect(kit.colors.map((c) => c.name)).not.toContain('Accent')
  })
})

describe('shouldClosePanelOnKey', () => {
  it('closes on a plain Escape', () => {
    expect(shouldClosePanelOnKey(new KeyboardEvent('keydown', { key: 'Escape' }))).toBe(true)
  })

  it('leaves the panel open when a popover already handled Escape', () => {
    const e = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    e.preventDefault()
    expect(shouldClosePanelOnKey(e)).toBe(false)
  })

  it('ignores other keys', () => {
    expect(shouldClosePanelOnKey(new KeyboardEvent('keydown', { key: 'a' }))).toBe(false)
  })
})

describe('BrandKit kits and logo', () => {
  it('creates a new kit and switches to it', () => {
    render(<BrandKit />)
    fireEvent.click(screen.getByRole('button', { name: 'New brand kit' }))
    const s = useTweetStudioStore.getState()
    expect(s.brandKits.length).toBeGreaterThan(1)
    expect(s.activeBrandKitId).toBe(s.brandKits[s.brandKits.length - 1].id)
  })

  it('shows the logo upload, and placement once a logo exists', () => {
    const kit = useTweetStudioStore.getState().brandKits[0]
    useTweetStudioStore.setState({ activeBrandKitId: kit.id })
    render(<BrandKit />)
    expect(screen.getByText(/upload logo/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Logo top right' })).toBeNull()
    cleanup()

    useTweetStudioStore.getState().setBrandLogo(kit.id, 'data:image/png;base64,AAA')
    render(<BrandKit />)
    fireEvent.click(screen.getByRole('button', { name: 'Logo top right' }))
    expect(useTweetStudioStore.getState().logoOverlay.position).toBe('top-right')
  })
})
