import { Slider } from '@/components/ui/slider'
import { useTweetStudioStore } from '../../-state'
import { TEMPLATES, PADDING_RANGE } from '../../-constants'
import type { TweetCardTheme, ShadowPreset } from '../../-types'
import { cn } from '../../-utils'
import { trackDesignPreset, trackCanvasSizeChange, trackCardThemeChange } from '@/lib/analytics'

const THEMES: { value: TweetCardTheme; label: string; bg: string; border: string }[] = [
    { value: 'light', label: 'Light', bg: 'bg-white', border: 'border-slate-300' },
    { value: 'dark', label: 'Dark', bg: 'bg-black', border: 'border-slate-700' },
    { value: 'dim', label: 'Dim', bg: 'bg-[#15202B]', border: 'border-slate-600' },
]

const CANVAS_TEMPLATES = [
    { id: 'instagram', label: 'Instagram', ratio: '1:1', width: 1080, height: 1080 },
    { id: 'story', label: 'Story', ratio: '9:16', width: 1080, height: 1920 },
    { id: 'linkedin', label: 'LinkedIn', ratio: '1.91:1', width: 1200, height: 627 },
    { id: 'twitter', label: 'Twitter/X', ratio: '16:9', width: 1600, height: 900 },
]

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
        setShadowIntensity,
        setFontSizeMultiplier,
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
        trackCanvasSizeChange(template.label, template.width, template.height)
    }

    const activeCanvasTemplate = CANVAS_TEMPLATES.find(
        t => t.width === exportSettings.width && t.height === exportSettings.height
    )

    return (
        <div className="space-y-5">
            {/* Card Theme */}
            <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Theme</p>
                <div className="flex bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg gap-0.5">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.value}
                            onClick={() => {
                                setTweetTheme(theme.value)
                                trackCardThemeChange(theme.value)
                            }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all",
                                tweet.theme === theme.value
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            <div className={cn('w-3 h-3 rounded-sm border', theme.bg, theme.border)} />
                            {theme.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            {/* Canvas Size */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Canvas</p>
                    <span className="text-[10px] font-mono text-slate-400">
                        {exportSettings.width}×{exportSettings.height}
                    </span>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg gap-0.5">
                    {CANVAS_TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateClick(template)}
                            className={cn(
                                "flex-1 flex flex-col items-center px-1 py-1.5 rounded-md text-[10px] transition-all",
                                template.id === activeCanvasTemplate?.id
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            <span className="font-medium truncate">{template.label}</span>
                            <span className="text-[8px] opacity-50">{template.ratio}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            {/* Card Style */}
            <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Style</p>
                <div className="grid grid-cols-5 gap-1.5">
                    {TEMPLATES.map((template) => {
                        const isActive = design.templateId === template.id
                        return (
                            <button
                                key={template.id}
                                onClick={() => {
                                    setTemplateId(template.id)
                                    trackDesignPreset(template.id)
                                }}
                                className={cn(
                                    'flex flex-col items-center gap-1 rounded-md p-1.5 transition-all',
                                    isActive
                                        ? 'bg-slate-100 dark:bg-slate-800'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
                                    'text-[9px] font-medium',
                                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                                )}>
                                    {template.name}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            {/* Sliders */}
            <div className="space-y-4">
                {/* Card Size */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Card Size</p>
                        <span className="text-[10px] font-mono text-slate-400">
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

                {/* Padding */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Padding</p>
                        <span className="text-[10px] font-mono text-slate-400">{design.padding}px</span>
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

                {/* Font Size */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Font Size</p>
                        <span className="text-[10px] font-mono text-slate-400">
                            {Math.round((design.fontSizeMultiplier || 1.0) * 100)}%
                        </span>
                    </div>
                    <Slider
                        value={[design.fontSizeMultiplier || 1.0]}
                        onValueChange={([value]) => setFontSizeMultiplier(value)}
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        className="w-full"
                    />
                </div>

                {/* Shadow */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Shadow</p>
                        <span className="text-[10px] font-mono text-slate-400">{design.shadowIntensity || 50}</span>
                    </div>
                    <Slider
                        value={[design.shadowIntensity || 50]}
                        onValueChange={([value]) => setShadowIntensity(value)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}
