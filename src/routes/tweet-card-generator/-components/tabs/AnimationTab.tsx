import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useTweetStudioStore } from '../../-state'
import { ANIMATION_SPEED_RANGE } from '../../-constants'
import type { AnimationType } from '../../-types'
import { cn } from '../../-utils'

const ANIMATION_TYPES = [
    { value: 'none', label: 'None', icon: '⊘' },
    { value: 'typewriter', label: 'Type', icon: '⌨' },
    { value: 'fade', label: 'Fade', icon: '◐' },
    { value: 'slide-up', label: 'Slide', icon: '↑' },
    { value: 'bounce', label: 'Bounce', icon: '◎' },
    { value: 'pop', label: 'Pop', icon: '◉' },
    { value: 'highlight', label: 'Glow', icon: '✦' },
    { value: 'glow', label: 'Pulse', icon: '○' },
] as const

const DELAY_OPTIONS = [0, 0.5, 1] as const

export function AnimationTab() {
    const {
        animation,
        tweet,
        setAnimationType,
        setAnimationSpeed,
        setAnimationDelay,
        setAnimationLoop,
        setShowCursor,
    } = useTweetStudioStore()

    const estimatedDuration = tweet.content.text.length / animation.speed
    const estimatedFrames = Math.ceil(estimatedDuration * animation.fps)

    return (
        <div className="space-y-5">
            {/* Animation Type */}
            <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Effect</p>
                <div className="grid grid-cols-4 gap-1.5">
                    {ANIMATION_TYPES.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setAnimationType(type.value as AnimationType)}
                            className={cn(
                                "flex flex-col items-center gap-0.5 p-2 rounded-md transition-all",
                                animation.type === type.value
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                            )}
                        >
                            <span className="text-sm">{type.icon}</span>
                            <span className="text-[9px] font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Settings (only when animation enabled) */}
            {animation.enabled && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                    {/* Speed */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Speed</p>
                            <span className="text-[10px] font-mono text-slate-400">{animation.speed} c/s</span>
                        </div>
                        <Slider
                            value={[animation.speed]}
                            onValueChange={([value]) => setAnimationSpeed(value)}
                            min={ANIMATION_SPEED_RANGE.min}
                            max={ANIMATION_SPEED_RANGE.max}
                            step={5}
                            className="w-full"
                        />
                    </div>

                    {/* Delay */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Delay</p>
                        <div className="flex gap-1">
                            {DELAY_OPTIONS.map((delay) => (
                                <button
                                    key={delay}
                                    onClick={() => setAnimationDelay(delay)}
                                    className={cn(
                                        "flex-1 h-7 rounded-md text-[10px] font-medium transition-all",
                                        animation.delay === delay
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    )}
                                >
                                    {delay}s
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                    {/* Toggles */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-medium text-slate-500">Loop</p>
                            <Switch
                                checked={animation.loop}
                                onCheckedChange={setAnimationLoop}
                                className="scale-75 origin-right"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-medium text-slate-500">Cursor</p>
                            <Switch
                                checked={animation.showCursor}
                                onCheckedChange={setShowCursor}
                                className="scale-75 origin-right"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            {/* Estimate */}
            <div className="flex justify-between text-[10px]">
                <div>
                    <p className="text-slate-400">Duration</p>
                    <p className="font-medium text-slate-600 dark:text-slate-300">{estimatedDuration.toFixed(1)}s</p>
                </div>
                <div className="text-center">
                    <p className="text-slate-400">Frames</p>
                    <p className="font-medium text-slate-600 dark:text-slate-300">{estimatedFrames}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-400">Est. Size</p>
                    <p className="font-medium text-slate-600 dark:text-slate-300">~2MB</p>
                </div>
            </div>
        </div>
    )
}
