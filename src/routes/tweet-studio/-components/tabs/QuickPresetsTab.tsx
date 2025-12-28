import { Slider } from '@/components/ui/slider'
import { useTweetStudioStore } from '../../-state'
import { TEMPLATES, PADDING_RANGE } from '../../-constants'
import type { TweetCardTheme } from '../../-types'
import { cn } from '../../-utils'
import { trackDesignPreset } from '@/lib/analytics'

// Theme options
const THEMES: { value: TweetCardTheme; label: string; bg: string; border: string }[] = [
    { value: 'light', label: 'Light', bg: 'bg-white', border: 'border-slate-300' },
    { value: 'dark', label: 'Dark', bg: 'bg-black', border: 'border-slate-700' },
    { value: 'dim', label: 'Dim', bg: 'bg-[#15202B]', border: 'border-slate-600' },
]

// Simplified canvas templates for horizontal segment control
const CANVAS_TEMPLATES = [
    {
        id: 'instagram',
        label: 'Instagram',
        ratio: '1:1',
        width: 1080,
        height: 1080,
    },
    {
        id: 'story',
        label: 'Story',
        ratio: '9:16',
        width: 1080,
        height: 1920,
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        ratio: '1.91:1',
        width: 1200,
        height: 627,
    },
    {
        id: 'twitter',
        label: 'Twitter/X',
        ratio: '16:9',
        width: 1600,
        height: 900,
    },
]

// Shadow preview styles
const SHADOW_PREVIEW: Record<string, string> = {
    none: '',
    soft: 'shadow-md',
    medium: 'shadow-xl',
    hard: 'shadow-[4px_4px_0_0_#000]',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
}

export function QuickPresetsTab() {
    const {
        tweet,
        design,
        setCustomSize,
        setScale,
        setTemplateId,
        setPadding,
        setCardScale,
        setTweetTheme,
        export: exportSettings,
    } = useTweetStudioStore()

    const handleTemplateClick = (template: typeof CANVAS_TEMPLATES[0]) => {
        let scale = 1
        if (template.height > template.width) {
            scale = 0.5
        } else if (template.width > template.height * 1.5) {
            scale = 0.7
        }
        setCustomSize(template.width, template.height)
        setScale(scale)
    }

    const activeCanvasTemplate = CANVAS_TEMPLATES.find(
        t => t.width === exportSettings.width && t.height === exportSettings.height
    )

    return (
        <div className="space-y-5">
            {/* Card Theme - Compact like Canvas Size */}
            <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Card Theme</span>
                <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg gap-0.5">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.value}
                            type="button"
                            onClick={() => setTweetTheme(theme.value)}
                            className={`
                                flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all
                                ${tweet.theme === theme.value
                                    ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-700/50'
                                }
                            `}
                        >
                            <div className={cn(
                                'w-4 h-3 rounded-sm border',
                                theme.bg, theme.border
                            )} />
                            <span>{theme.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Size */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Canvas Size</span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                        {exportSettings.width} × {exportSettings.height}
                    </span>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg gap-0.5">
                    {CANVAS_TEMPLATES.map((template) => {
                        const isActive = template.id === activeCanvasTemplate?.id
                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => handleTemplateClick(template)}
                                className={`
                                    flex-1 px-1.5 py-1.5 rounded-md text-[10px] font-medium transition-all
                                    ${isActive
                                        ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-700/50'
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center gap-0">
                                    <span className="truncate">{template.label}</span>
                                    <span className="text-[8px] opacity-50">{template.ratio}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Card Style */}
            <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Card Style</span>
                <div className="grid grid-cols-5 gap-2">
                    {TEMPLATES.map((template) => {
                        const isActive = design.templateId === template.id
                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => {
                                    setTemplateId(template.id)
                                    trackDesignPreset(template.id)
                                }}
                                className={cn(
                                    'flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all',
                                    isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-full aspect-[4/3] rounded bg-white dark:bg-slate-200 transition-all',
                                        SHADOW_PREVIEW[template.shadow] || '',
                                        isActive && 'ring-2 ring-blue-500'
                                    )}
                                    style={{ borderRadius: Math.min(template.borderRadius / 4, 6) }}
                                />
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                                )}>
                                    {template.name}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Card Size Slider */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Card Size</span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                        {Math.round((design.cardScale || 1) * 100)}%
                    </span>
                </div>
                <Slider
                    value={[design.cardScale || 1]}
                    onValueChange={([value]) => setCardScale(value)}
                    min={0.7}
                    max={1.5}
                    step={0.05}
                    className="w-full"
                />
            </div>

            {/* Padding Slider */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Padding</span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                        {design.padding}px
                    </span>
                </div>
                <Slider
                    value={[design.padding]}
                    onValueChange={([value]) => setPadding(value)}
                    min={PADDING_RANGE.min}
                    max={PADDING_RANGE.max}
                    step={PADDING_RANGE.step}
                    className="w-full"
                />
            </div>
        </div>
    )
}
