import { Image as ImageIcon, Film } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { cn } from '@/lib/utils'

export function ModeToggle() {
    const studioMode = useTweetStudioStore((state) => state.studioMode)
    const setStudioMode = useTweetStudioStore((state) => state.setStudioMode)

    return (
        <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md p-1 rounded-full shadow-soft-sm border border-border">
            <button
                onClick={() => setStudioMode('static')}
                className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all",
                    studioMode === 'static'
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent"
                )}
            >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Static</span>
            </button>
            <button
                onClick={() => setStudioMode('gif')}
                className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all",
                    studioMode === 'gif'
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent"
                )}
            >
                <Film className="w-3.5 h-3.5" />
                <span>GIF</span>
            </button>
        </div>
    )
}
