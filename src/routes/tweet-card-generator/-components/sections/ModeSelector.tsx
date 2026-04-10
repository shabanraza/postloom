import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Link2, PenLine } from 'lucide-react'
import { cn } from '../../-utils'

type InputMode = 'manual' | 'url'

export function ModeSelector() {
    const mode: InputMode = 'manual'
    const modes = [
        { value: 'manual' as const, icon: PenLine, label: 'Manual' },
        { value: 'url' as const, icon: Link2, label: 'URL' },
    ]

    return (
        <RadioGroup value={mode} className="flex w-full bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {modes.map((m) => (
                <Label
                    key={m.value}
                    htmlFor={`mode-${m.value}`}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all',
                        mode === m.value
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white font-medium'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50',
                        m.value === 'url' && 'opacity-60 cursor-not-allowed'
                    )}
                >
                    <m.icon className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
                    <RadioGroupItem
                        value={m.value}
                        id={`mode-${m.value}`}
                        className="sr-only"
                        disabled={m.value === 'url'}
                    />
                </Label>
            ))}
        </RadioGroup>
    )
}
