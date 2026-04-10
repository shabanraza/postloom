import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { COLOR_PRESETS, GRADIENT_PRESETS, PATTERN_PRESETS } from '../../-constants'
import type { BackgroundType, PatternType } from '../../-types'
import { cn } from '../../-utils'
import { trackBackgroundChange } from '@/lib/analytics'

const BG_TYPES = [
    { value: 'solid', label: 'Solid' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'glass', label: 'Glass' },
    { value: 'pattern', label: 'Pattern' },
    { value: 'image', label: 'Image' },
] as const

export function BackgroundTab() {
    const {
        design,
        setBackgroundType,
        setBackgroundColor,
        setGradient,
        setPatternType,
        setBackgroundImageUrl,
    } = useTweetStudioStore()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setBackgroundImageUrl(url)
        }
    }

    const handleRemoveImage = () => {
        setBackgroundImageUrl(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-5">
            {/* Background Type */}
            <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Type</p>
                <div className="flex bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg gap-0.5">
                    {BG_TYPES.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => {
                                setBackgroundType(type.value as BackgroundType)
                                trackBackgroundChange(type.value)
                            }}
                            className={cn(
                                "flex-1 px-1.5 py-1.5 rounded-md text-[10px] font-medium transition-all",
                                design.backgroundType === type.value
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            {/* Solid Colors */}
            {design.backgroundType === 'solid' && (
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Color</p>
                    <div className="grid grid-cols-8 gap-1.5">
                        {COLOR_PRESETS.map((color) => (
                            <button
                                key={color}
                                className={cn(
                                    'aspect-square rounded-full transition-all hover:scale-110',
                                    design.backgroundColor === color
                                        ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110'
                                        : ''
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => setBackgroundColor(color)}
                            />
                        ))}
                        <label className="relative aspect-square rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-all overflow-hidden">
                            <input
                                type="color"
                                value={design.backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400">+</span>
                        </label>
                    </div>
                </div>
            )}

            {/* Gradients */}
            {design.backgroundType === 'gradient' && (
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Gradient</p>
                    <div className="grid grid-cols-8 gap-1.5">
                        {GRADIENT_PRESETS.map((gradient, idx) => (
                            <button
                                key={idx}
                                className={cn(
                                    'aspect-square rounded-full transition-all hover:scale-110',
                                    design.gradient?.colors.join() === gradient.colors.join()
                                        ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110'
                                        : ''
                                )}
                                style={{
                                    background: `linear-gradient(135deg, ${gradient.colors.join(', ')})`,
                                }}
                                onClick={() => setGradient({ colors: [...gradient.colors], direction: gradient.direction })}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Patterns */}
            {design.backgroundType === 'pattern' && (
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pattern</p>
                    <div className="grid grid-cols-5 gap-1.5">
                        {PATTERN_PRESETS.map((pattern) => (
                            <button
                                key={pattern.id}
                                className={cn(
                                    'h-9 rounded-md flex items-center justify-center transition-all',
                                    design.patternType === pattern.id
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                )}
                                onClick={() => setPatternType(pattern.id as PatternType)}
                                title={pattern.name}
                            >
                                <span className="text-sm">{pattern.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Backgrounds */}
            {design.backgroundType === 'image' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Presets</p>
                        <div className="grid grid-cols-4 gap-1.5">
                            {[
                                'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=90',
                                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=90',
                                'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=90',
                                'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=90',
                                'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=90',
                                'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=90',
                                'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=90',
                                'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=90',
                            ].map((url) => (
                                <button
                                    key={url}
                                    onClick={() => setBackgroundImageUrl(url)}
                                    className={cn(
                                        'aspect-square rounded-md overflow-hidden transition-all hover:scale-105',
                                        design.backgroundImageUrl === url
                                            ? 'ring-2 ring-slate-900 dark:ring-white'
                                            : ''
                                    )}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Upload</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="bg-image-upload"
                        />

                        {design.backgroundImageUrl && !design.backgroundImageUrl.startsWith('https://images.unsplash') ? (
                            <div className="relative rounded-md overflow-hidden">
                                <img src={design.backgroundImageUrl} alt="" className="w-full h-14 object-cover" />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="bg-image-upload"
                                className="flex items-center justify-center gap-2 h-9 rounded-md border border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                            >
                                <Upload className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] text-slate-400">Upload image</span>
                            </label>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
