import { CircleHelp, Keyboard, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEditorUi } from '../-state/editor-ui'

export function HelpMenu() {
    const setShortcutsOpen = useEditorUi((s) => s.setShortcutsOpen)
    const setTourOpen = useEditorUi((s) => s.setTourOpen)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Help"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent"
                >
                    <CircleHelp className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onSelect={() => setTourOpen(true)} className="gap-2">
                    <Map className="h-4 w-4" />
                    Take the tour
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShortcutsOpen(true)} className="hidden gap-2 sm:flex">
                    <Keyboard className="h-4 w-4" />
                    Keyboard shortcuts
                    <kbd className="ml-auto font-mono text-[10px] text-muted-foreground">?</kbd>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
