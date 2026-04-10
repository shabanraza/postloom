import { useEffect } from 'react'
import { X, FileText, Sparkles, Image, Wand2, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PanelType } from './IconSidebar'

// Import tab content components
import { ContentTab } from './SettingsPanel/ContentTab'
import { DesignTab } from './SettingsPanel/DesignTab'
import { BackgroundTab } from './tabs/BackgroundTab'
import { AnimationTab } from './tabs/AnimationTab'
import { BrandKit } from './BrandKit'

interface ExpandablePanelProps {
    activePanel: PanelType
    onClose: () => void
}

const PANEL_CONFIG = {
    content: { icon: FileText, label: 'Content', color: 'text-blue-500' },
    design: { icon: Sparkles, label: 'Design', color: 'text-purple-500' },
    background: { icon: Image, label: 'Background', color: 'text-green-500' },
    animation: { icon: Wand2, label: 'Animation', color: 'text-amber-500' },
    brandkit: { icon: Palette, label: 'Brand Kit', color: 'text-pink-500' },
}

export function ExpandablePanel({ activePanel, onClose }: ExpandablePanelProps) {
    // Panel stays open - no click-outside-to-close behavior
    // User can close by clicking the X button or clicking the same icon in sidebar

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (activePanel) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [activePanel, onClose])

    if (!activePanel) return null

    const config = PANEL_CONFIG[activePanel]
    const Icon = config.icon

    return (
        <>
            {/* Panel */}
            <div
                className={cn(
                    "fixed top-14 left-14 bottom-0 w-80 z-50",
                    "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
                    "shadow-2xl shadow-black/10 dark:shadow-black/30",
                    "animate-in slide-in-from-left-5 duration-200",
                    "flex flex-col"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", config.color)} />
                        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {config.label}
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content - Scrollable, no horizontal overflow */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                    {activePanel === 'content' && <ContentTab />}
                    {activePanel === 'design' && <DesignTab />}
                    {activePanel === 'background' && <BackgroundTab />}
                    {activePanel === 'animation' && <AnimationTab />}
                    {activePanel === 'brandkit' && <BrandKit />}
                </div>
            </div>
        </>
    )
}

