import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Keyboard } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const shortcuts = [
    {
        category: 'General', items: [
            { keys: ['⌘', 'Z'], description: 'Undo' },
            { keys: ['⌘', '⇧', 'Z'], description: 'Redo' },
            { keys: ['⌘', 'S'], description: 'Save as PNG' },
            { keys: ['⌘', '⇧', 'S'], description: 'Save as GIF' },
            { keys: ['⌘', 'R'], description: 'Reset all' },
            { keys: ['⌘', 'D'], description: 'Duplicate' },
        ]
    },
    {
        category: 'Text', items: [
            { keys: ['Tab'], description: 'Next input' },
            { keys: ['⇧', 'Tab'], description: 'Previous input' },
        ]
    },
    {
        category: 'View', items: [
            { keys: ['⌘', '1'], description: 'Presets tab' },
            { keys: ['⌘', '2'], description: 'Templates tab' },
            { keys: ['⌘', '3'], description: 'Background tab' },
            { keys: ['⌘', '4'], description: 'Animation tab' },
            { keys: ['⌘', 'L'], description: 'Toggle theme' },
        ]
    },
]

export function KeyboardShortcutsModal() {
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Keyboard className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Keyboard shortcuts</TooltipContent>
            </Tooltip>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="h-5 w-5" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Speed up your workflow with these shortcuts
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {shortcuts.map((section) => (
                        <div key={section.category}>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                {section.category}
                            </h4>
                            <div className="space-y-1.5">
                                {section.items.map((shortcut, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
                                    >
                                        <span className="text-sm">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIdx) => (
                                                <kbd
                                                    key={keyIdx}
                                                    className="px-2 py-0.5 text-xs font-mono bg-muted border rounded"
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
