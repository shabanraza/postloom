import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEditorUi } from '../-state/editor-ui'

export const SHORTCUTS: { keys: string[]; action: string }[] = [
    { keys: ['Ctrl', 'Z'], action: 'Undo' },
    { keys: ['Ctrl', 'Y'], action: 'Redo (or Ctrl + Shift + Z)' },
    { keys: ['1'], action: 'Open the Content panel' },
    { keys: ['2'], action: 'Open the Design panel' },
    { keys: ['3'], action: 'Open the Background panel' },
    { keys: ['4'], action: 'Open the Animation panel' },
    { keys: ['5'], action: 'Open the Brand Kit panel' },
    { keys: ['Esc'], action: 'Close the open panel' },
    { keys: ['?'], action: 'Show these shortcuts' },
]

/** "?" is Shift+/ on most keyboards; some report the key as "/" with Shift held. */
export function isShortcutsKey(e: KeyboardEvent): boolean {
    return e.key === '?' || (e.key === '/' && e.shiftKey)
}

function isMac() {
    return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
}

export function ShortcutsDialog() {
    const open = useEditorUi((s) => s.shortcutsOpen)
    const setOpen = useEditorUi((s) => s.setShortcutsOpen)
    const mac = isMac()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Keyboard shortcuts</DialogTitle>
                    <DialogDescription>They work whenever you are not typing in a field.</DialogDescription>
                </DialogHeader>
                <ul className="divide-y divide-border text-sm">
                    {SHORTCUTS.map((s) => (
                        <li key={s.action} className="flex items-center justify-between gap-4 py-2">
                            <span className="text-muted-foreground">{s.action}</span>
                            <span className="flex shrink-0 gap-1">
                                {s.keys.map((k) => (
                                    <kbd
                                        key={k}
                                        className="min-w-6 rounded-md border border-border bg-muted px-1.5 py-0.5 text-center font-mono text-[11px] text-foreground"
                                    >
                                        {mac && k === 'Ctrl' ? '⌘' : k}
                                    </kbd>
                                ))}
                            </span>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    )
}
