import { create } from 'zustand'

/** Short-lived editor UI state (not saved): help dialogs and the guided tour. */
interface EditorUiState {
    shortcutsOpen: boolean
    tourOpen: boolean
    setShortcutsOpen: (open: boolean) => void
    setTourOpen: (open: boolean) => void
}

export const useEditorUi = create<EditorUiState>()((set) => ({
    shortcutsOpen: false,
    tourOpen: false,
    setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
    setTourOpen: (tourOpen) => set({ tourOpen }),
}))
