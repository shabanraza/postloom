// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useTweetStudioStore } from '../../-state'
import { SavedStyles } from '../SavedStyles'

const fresh = useTweetStudioStore.getState()
beforeEach(() => useTweetStudioStore.setState(fresh, true))
afterEach(() => cleanup())

describe('SavedStyles', () => {
  it('saves the current look under a name', () => {
    render(<SavedStyles />)
    fireEvent.click(screen.getByRole('button', { name: /save current style/i }))
    fireEvent.change(screen.getByPlaceholderText(/name this style/i), { target: { value: 'Launch' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(useTweetStudioStore.getState().savedStyles.map((s) => s.name)).toEqual(['Launch'])
    expect(screen.getByRole('button', { name: 'Apply style Launch' })).toBeTruthy()
  })

  it('applies a saved style in one click', () => {
    useTweetStudioStore.getState().setPadding(150)
    useTweetStudioStore.getState().saveStyle('Roomy')
    useTweetStudioStore.getState().setPadding(10)
    render(<SavedStyles />)
    fireEvent.click(screen.getByRole('button', { name: 'Apply style Roomy' }))
    expect(useTweetStudioStore.getState().design.padding).toBe(150)
  })
})
