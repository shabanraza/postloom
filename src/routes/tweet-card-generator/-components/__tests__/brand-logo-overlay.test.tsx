// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { useTweetStudioStore } from '../../-state'
import { BrandLogoOverlay } from '../BrandLogoOverlay'

const fresh = useTweetStudioStore.getState()
beforeEach(() => useTweetStudioStore.setState(fresh, true))
afterEach(() => cleanup())

describe('BrandLogoOverlay', () => {
  it('draws the active kit logo in the chosen corner', () => {
    useTweetStudioStore.getState().setBrandLogo('default', 'data:image/png;base64,AAA')
    useTweetStudioStore.getState().setLogoOverlay({ position: 'top-left', size: 10 })
    render(<BrandLogoOverlay canvasWidth={1600} canvasHeight={900} />)
    const img = screen.getByAltText('Brand logo') as HTMLImageElement
    expect(img.src).toContain('data:image/png')
    expect(img.style.top).toBe('36px')
    expect(img.style.left).toBe('36px')
    expect(img.style.width).toBe('90px')
  })

  it('draws nothing without a logo', () => {
    useTweetStudioStore.getState().setLogoOverlay({ position: 'top-left' })
    const { container } = render(<BrandLogoOverlay canvasWidth={1600} canvasHeight={900} />)
    expect(container.innerHTML).toBe('')
  })
})
