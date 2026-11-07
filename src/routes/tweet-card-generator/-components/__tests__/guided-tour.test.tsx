// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { GuidedTour, TOUR_STEPS, placeTourCard } from '../GuidedTour'
import { useEditorUi } from '../../-state/editor-ui'

beforeEach(() => {
  localStorage.clear()
  useEditorUi.setState({ tourOpen: true, shortcutsOpen: false })
})
afterEach(() => cleanup())

describe('placeTourCard', () => {
  const card = { width: 320, height: 180 }

  it('sits to the right of a sidebar item', () => {
    const pos = placeTourCard({ top: 100, left: 0, width: 56, height: 40 }, { width: 1440, height: 900 }, card)
    expect(pos.left).toBe(56 + 16)
    expect(pos.top).toBe(100)
  })

  it('goes below a button at the top-right edge and stays on screen', () => {
    const pos = placeTourCard({ top: 10, left: 1340, width: 90, height: 40 }, { width: 1440, height: 900 }, card)
    expect(pos.top).toBe(10 + 40 + 16)
    expect(pos.left + card.width).toBeLessThanOrEqual(1440 - 16)
  })

  it('centres the card when there is nothing to point at', () => {
    const pos = placeTourCard(null, { width: 1440, height: 900 }, card)
    expect(pos).toEqual({ top: 360, left: 560 })
  })
})

describe('GuidedTour', () => {
  it('walks through every step and remembers it was seen', () => {
    render(<GuidedTour />)
    expect(screen.getByText(TOUR_STEPS[0].title)).toBeTruthy()
    for (let i = 1; i < TOUR_STEPS.length; i++) {
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(screen.getByText(TOUR_STEPS[i].title)).toBeTruthy()
    }
    fireEvent.click(screen.getByRole('button', { name: /start creating/i }))
    expect(useEditorUi.getState().tourOpen).toBe(false)
    expect(localStorage.getItem('postloom-onboarding-complete')).toBe('true')
  })

  it('can be skipped', () => {
    render(<GuidedTour />)
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(useEditorUi.getState().tourOpen).toBe(false)
  })

  it('Escape closes it', () => {
    render(<GuidedTour />)
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(useEditorUi.getState().tourOpen).toBe(false)
  })
})
