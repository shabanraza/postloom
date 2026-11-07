import { useState } from 'react'
import { Bookmark, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTweetStudioStore } from '../-state'
import { getGradientStyle } from '../-utils'
import type { SavedStyle } from '../-types'

function swatchFor(style: SavedStyle): React.CSSProperties {
    const d = style.design
    if (d.backgroundType === 'gradient' && d.gradient) {
        return { background: getGradientStyle(d.gradient.colors, d.gradient.direction) }
    }
    return { backgroundColor: d.backgroundColor }
}

/** Save the whole look (background, card theme, spacing, font, size) and re-apply it in one click. */
export function SavedStyles() {
    const savedStyles = useTweetStudioStore((s) => s.savedStyles)
    const saveStyle = useTweetStudioStore((s) => s.saveStyle)
    const applySavedStyle = useTweetStudioStore((s) => s.applySavedStyle)
    const deleteSavedStyle = useTweetStudioStore((s) => s.deleteSavedStyle)
    const [naming, setNaming] = useState(false)
    const [name, setName] = useState('')

    const submit = () => {
        saveStyle(name)
        setName('')
        setNaming(false)
    }

    return (
        <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">My styles</p>

            {savedStyles.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5">
                    {savedStyles.map((style) => (
                        <div key={style.id} className="group relative">
                            <button
                                type="button"
                                aria-label={`Apply style ${style.name}`}
                                onClick={() => applySavedStyle(style.id)}
                                className="flex w-full items-center gap-2 rounded-lg border border-border p-1.5 text-left text-xs transition-colors hover:border-foreground/30"
                            >
                                <span
                                    className="h-7 w-7 shrink-0 rounded-md border border-foreground/10"
                                    style={swatchFor(style)}
                                />
                                <span className="min-w-0 flex-1 truncate font-medium">{style.name}</span>
                            </button>
                            <button
                                type="button"
                                aria-label={`Delete style ${style.name}`}
                                onClick={() => deleteSavedStyle(style.id)}
                                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                            >
                                <X className="h-2.5 w-2.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {naming ? (
                <form
                    className="flex gap-1.5"
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit()
                    }}
                >
                    <Input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name this style"
                        maxLength={40}
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault()
                                setNaming(false)
                            }
                        }}
                    />
                    <Button type="submit" size="sm" className="h-8">
                        Save
                    </Button>
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => setNaming(true)}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                    {savedStyles.length === 0 ? <Bookmark className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    Save current style
                </button>
            )}
            {savedStyles.length === 0 && !naming && (
                <p className="text-[11px] leading-snug text-muted-foreground">
                    Keeps the background, card theme, spacing, font and size so you can reuse them on your next post.
                </p>
            )}
        </div>
    )
}
