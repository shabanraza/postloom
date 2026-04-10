import { FileText, Sparkles, Image, Wand2, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

export type PanelType = 'content' | 'design' | 'background' | 'animation' | 'brandkit' | null

interface IconSidebarProps {
    activePanel: PanelType
    onPanelChange: (panel: PanelType) => void
}

const SIDEBAR_ITEMS = [
    { id: 'content' as const, icon: FileText, label: 'Content', shortcut: '1' },
    { id: 'design' as const, icon: Sparkles, label: 'Design', shortcut: '2' },
    { id: 'background' as const, icon: Image, label: 'Background', shortcut: '3' },
    { id: 'animation' as const, icon: Wand2, label: 'Animation', shortcut: '4' },
    { id: 'brandkit' as const, icon: Palette, label: 'Brand Kit', shortcut: '5' },
]

export function IconSidebar({ activePanel, onPanelChange }: IconSidebarProps) {
    const handleClick = (panelId: PanelType) => {
        // Toggle panel: if clicking active panel, close it; otherwise open new one
        if (activePanel === panelId) {
            onPanelChange(null)
        } else {
            onPanelChange(panelId)
        }
    }

    return (
        <TooltipProvider delayDuration={200}>
            <aside className="w-14 shrink-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-1 z-50">
                {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = activePanel === item.id

                    return (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => handleClick(item.id)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                                        "hover:bg-slate-100 dark:hover:bg-slate-800",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                                        isActive && "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md",
                                        !isActive && "text-slate-500 dark:text-slate-400"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-2">
                                <span>{item.label}</span>
                                <kbd className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {item.shortcut}
                                </kbd>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Optional: Additional icons at bottom */}
                <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mb-2" />
            </aside>
        </TooltipProvider>
    )
}

