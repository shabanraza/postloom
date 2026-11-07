// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ShortcutsDialog, SHORTCUTS, isShortcutsKey } from '../ShortcutsDialog'
import { useEditorUi } from '../../-state/editor-ui'

afterEach(() => cleanup())

describe('ShortcutsDialog', () => {
  it('lists undo, redo, panels and help', () => {
    const actions = SHORTCUTS.map((s) => s.action).join(' | ')
    expect(actions).toMatch(/Undo/)
    expect(actions).toMatch(/Redo/)
    expect(actions).toMatch(/panel/i)
    expect(actions).toMatch(/shortcuts/i)
  })

  it('shows them when opened', () => {
    useEditorUi.setState({ shortcutsOpen: true })
    render(<ShortcutsDialog />)
    expect(screen.getByText('Keyboard shortcuts')).toBeTruthy()
    expect(screen.getByText(SHORTCUTS[0].action)).toBeTruthy()
  })
})

describe('isShortcutsKey', () => {
  it('accepts ? however the keyboard reports it', () => {
    expect(isShortcutsKey(new KeyboardEvent('keydown', { key: '?' }))).toBe(true)
    expect(isShortcutsKey(new KeyboardEvent('keydown', { key: '/', shiftKey: true }))).toBe(true)
    expect(isShortcutsKey(new KeyboardEvent('keydown', { key: '/' }))).toBe(false)
  })
})
