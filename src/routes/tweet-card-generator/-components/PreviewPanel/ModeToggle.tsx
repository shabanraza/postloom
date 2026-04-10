import { Image as ImageIcon, Film } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { cn } from '@/lib/utils'

export function ModeToggle() {
    const studioMode = useTweetStudioStore((state) => state.studioMode)
    const setStudioMode = useTweetStudioStore((state) => state.setStudioMode)

    return (
        <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-full shadow-soft-sm border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setStudioMode('static')}
                className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all",
                    studioMode === 'static'
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
            >
                <Film className="w-3.5 h-3.5" />
                <span>GIF</span>
            </button>
        </div>
    )
}
