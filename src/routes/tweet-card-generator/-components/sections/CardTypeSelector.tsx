import { FileText, List, Quote } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useTweetStudioStore } from '../../-state'
import type { CardType } from '../../-types'

export function CardTypeSelector() {
    const cardType = useTweetStudioStore((state) => state.tweet.cardType || 'single')
    const setCardType = useTweetStudioStore((state) => state.setCardType)

    const cardTypes: { value: CardType; label: string; icon: React.ReactNode }[] = [
        { value: 'single', label: 'Single', icon: <FileText className="h-4 w-4" /> },
        { value: 'thread', label: 'Thread', icon: <List className="h-4 w-4" /> },
        { value: 'quote', label: 'Quote', icon: <Quote className="h-4 w-4" /> },
    ]

    return (
        <div className="space-y-2">
            <Label className="text-xs text-slate-500">Card Type</Label>
            <div className="grid grid-cols-3 gap-2">
                {cardTypes.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => setCardType(type.value)}
                        className={cn(
                            'flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-medium transition-all',
                            cardType === type.value
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        )}
                    >
                        {type.icon}
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

