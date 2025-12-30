import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, X } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { COLOR_PRESETS, GRADIENT_PRESETS, PATTERN_PRESETS } from '../../-constants'
import type { BackgroundType, PatternType } from '../../-types'
import { cn } from '../../-utils'
import { trackBackgroundChange } from '@/lib/analytics'

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
        <div className="space-y-4">
            {/* Background Type */}
            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Background Type</p>
                <RadioGroup
                    value={design.backgroundType}
                    onValueChange={(value) => {
                        setBackgroundType(value as BackgroundType)
                        trackBackgroundChange(value)
                    }}
                    className="grid grid-cols-5 gap-2"
                >
                    {[
                        { value: 'solid', label: 'Solid', icon: '◼' },
                        { value: 'gradient', label: 'Grad', icon: '◗' },
                        { value: 'glass', label: 'Glass', icon: '◻' },
                        { value: 'pattern', label: 'Patt', icon: '▦' },
                        { value: 'image', label: 'Image', icon: '🖼' },
                    ].map((type) => (
                        <Label
                            key={type.value}
                            htmlFor={`bg-${type.value}`}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg border p-2 cursor-pointer transition-all aspect-square',
                                design.backgroundType === type.value
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500'
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-accent'
                            )}
                        >
                            <RadioGroupItem value={type.value} id={`bg-${type.value}`} className="sr-only" />
                            <span className="text-lg">{type.icon}</span>
                            <span className="text-[10px] font-medium">{type.label}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            {/* Solid Color Picker */}
            {design.backgroundType === 'solid' && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Color</p>
                    <div className="grid grid-cols-8 gap-1.5">
                        {COLOR_PRESETS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={cn(
                                    'w-full aspect-square rounded-full border transition-all hover:scale-110 shadow-sm',
                                    design.backgroundColor === color
                                        ? 'border-blue-500 ring-2 ring-blue-500/30 scale-110'
                                        : 'border-slate-200 dark:border-slate-700'
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => setBackgroundColor(color)}
                                title={color}
                            />
                        ))}
                        {/* Custom Color Picker */}
                        <label
                            className={cn(
                                'relative w-full aspect-square rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-110 overflow-hidden',
                                design.backgroundColor && !COLOR_PRESETS.includes(design.backgroundColor)
                                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                                    : 'border-slate-300 dark:border-slate-600'
                            )}
                        >
                            <input
                                type="color"
                                value={design.backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <span className="text-xs text-slate-400 pointer-events-none">🎨</span>
                        </label>
                    </div>
                </div>
            )}

            {/* Gradient Picker */}
            {design.backgroundType === 'gradient' && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Gradient</p>
                    <div className="grid grid-cols-8 gap-1.5">
                        {GRADIENT_PRESETS.map((gradient, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={cn(
                                    'w-full aspect-square rounded-full border transition-all hover:scale-110 shadow-sm',
                                    design.gradient?.colors.join() === gradient.colors.join()
                                        ? 'border-blue-500 ring-2 ring-blue-500/30 scale-110'
                                        : 'border-slate-200 dark:border-slate-700'
                                )}
                                style={{
                                    background: `linear-gradient(to bottom right, ${gradient.colors.join(', ')})`,
                                }}
                                onClick={() => setGradient({ colors: [...gradient.colors], direction: gradient.direction })}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Pattern Picker */}
            {design.backgroundType === 'pattern' && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Pattern</p>
                    <div className="grid grid-cols-5 gap-2">
                        {PATTERN_PRESETS.map((pattern) => (
                            <button
                                key={pattern.id}
                                type="button"
                                className={cn(
                                    'h-10 rounded-lg border flex items-center justify-center transition-all hover:scale-105',
                                    design.patternType === pattern.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                                )}
                                onClick={() => setPatternType(pattern.id as PatternType)}
                                title={pattern.name}
                            >
                                <span className="text-lg">{pattern.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Backgrounds */}
            {design.backgroundType === 'image' && (
                <div className="space-y-3">
                    {/* Preset Images */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Preset Backgrounds</p>
                        <div className="grid grid-cols-4 gap-1.5">
                            {[
                                // Abstract & Gradients - great for social media
                                'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=90', // Purple gradient
                                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=90', // Colorful gradient
                                'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=90', // Pink gradient
                                'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=90', // Blue gradient
                                // Dark & Moody
                                'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=90', // Dark abstract
                                'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=90', // Mountains night
                                'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=90', // Dark blue
                                'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=90', // Neon dark
                            ].map((url) => (
                                <button
                                    key={url}
                                    type="button"
                                    onClick={() => setBackgroundImageUrl(url)}
                                    className={cn(
                                        'aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                                        design.backgroundImageUrl === url
                                            ? 'border-blue-500 ring-2 ring-blue-500/30'
                                            : 'border-transparent'
                                    )}
                                >
                                    <img
                                        src={url}
                                        alt="Background preset"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Upload */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Or Upload Custom</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="bg-image-upload"
                        />

                        {design.backgroundImageUrl && !design.backgroundImageUrl.startsWith('https://images.unsplash') ? (
                            <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                <img
                                    src={design.backgroundImageUrl}
                                    alt="Background"
                                    className="w-full h-16 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="bg-image-upload"
                                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                            >
                                <Upload className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-500">Upload image</span>
                            </label>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
