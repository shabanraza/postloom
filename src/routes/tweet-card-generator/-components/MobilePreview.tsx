import { useRef, useEffect, useState } from 'react'
import { Image as ImageIcon, Film } from 'lucide-react'
import { useTweetStudioStore } from '../-state'
import { CardRenderer } from './cards'
import { cn } from '@/lib/utils'
import type { DesignSettings, Platform } from '../-types'

// Platform icons
function TwitterIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

function ThreadsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.025.88-.732 2.107-1.17 3.546-1.266 1.08-.073 2.094.02 3.034.238-.017-.988-.232-1.755-.645-2.293-.462-.601-1.165-.918-2.09-.944-.737-.02-1.429.168-1.873.397l-.063.036-.742-1.734c.741-.397 1.714-.625 2.741-.6 1.47.042 2.63.583 3.45 1.608.745.931 1.124 2.178 1.159 3.798v.144c1.037.497 1.876 1.2 2.453 2.055.768 1.139 1.07 2.587.855 4.087-.345 2.385-1.643 4.163-3.753 5.14-1.466.679-3.205.992-5.326 1.016zm.083-7.994c-.63.042-1.159.19-1.518.433-.418.282-.633.67-.608 1.094.033.58.386 1.04.996 1.293.543.225 1.205.31 1.862.239 1.115-.119 1.863-.588 2.353-1.476.252-.458.441-1.022.553-1.69-.845-.192-1.74-.279-2.638-.235z" />
        </svg>
    )
}

function LinkedInIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    )
}

// Helper to generate background styles
function getBackgroundStyle(design: DesignSettings): React.CSSProperties {
    switch (design.backgroundType) {
        case 'solid':
            return { background: design.backgroundColor }
        case 'gradient':
            const dir = design.gradient?.direction === 'to-br' ? '135deg' :
                design.gradient?.direction === 'to-r' ? '90deg' : '135deg'
            return {
                background: `linear-gradient(${dir}, ${design.gradient?.colors?.[0] || '#3b82f6'}, ${design.gradient?.colors?.[1] || '#8b5cf6'})`
            }
        case 'glass':
            return {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }
        case 'pattern':
            return {
                background: design.backgroundColor,
                backgroundImage: getPatternImage(design.patternType),
                backgroundSize: '20px 20px',
            }
        case 'image':
            return design.backgroundImageUrl
                ? {
                    backgroundImage: `url(${design.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }
                : { background: design.backgroundColor }
        default:
            return { background: design.backgroundColor }
    }
}

function getPatternImage(patternType?: string): string {
    switch (patternType) {
        case 'dots':
            return 'radial-gradient(circle, #00000020 2px, transparent 2px)'
        case 'lines-h':
            return 'repeating-linear-gradient(0deg, transparent, transparent 10px, #00000015 10px, #00000015 11px)'
        case 'lines-v':
            return 'repeating-linear-gradient(90deg, transparent, transparent 10px, #00000015 10px, #00000015 11px)'
        case 'lines-d':
            return 'repeating-linear-gradient(45deg, transparent, transparent 10px, #00000015 10px, #00000015 11px)'
        case 'mesh':
            return 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)'
        default:
            return 'none'
    }
}

export function MobilePreview() {
    const design = useTweetStudioStore((state) => state.design)
    const exportSettings = useTweetStudioStore((state) => state.export)
    const studioMode = useTweetStudioStore((state) => state.studioMode)
    const setStudioMode = useTweetStudioStore((state) => state.setStudioMode)
    const platform = useTweetStudioStore((state) => state.platform)
    const setPlatform = useTweetStudioStore((state) => state.setPlatform)

    const containerRef = useRef<HTMLDivElement>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    // Auto-Fit Logic
    useEffect(() => {
        if (!containerRef.current) return
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect
            setContainerSize({ width, height })
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    const canvasWidth = exportSettings.width
    const canvasHeight = exportSettings.height

    // Calculate scale to fit container with padding
    const padding = 16
    const availableWidth = Math.max(0, containerSize.width - padding * 2)
    const availableHeight = Math.max(0, containerSize.height - padding * 2)

    const scaleX = availableWidth / canvasWidth
    const scaleY = availableHeight / canvasHeight
    const fitScale = Math.min(scaleX, scaleY, 0.8) // Max 80% to leave some breathing room
    const finalScale = fitScale > 0 ? fitScale : 0.2

    // Calculate scaled dimensions for centering
    const scaledWidth = canvasWidth * finalScale
    const scaledHeight = canvasHeight * finalScale

    const platforms: { id: Platform; icon: typeof TwitterIcon; label: string }[] = [
        { id: 'twitter', icon: TwitterIcon, label: 'X' },
        { id: 'threads', icon: ThreadsIcon, label: 'Threads' },
        { id: 'linkedin', icon: LinkedInIcon, label: 'LinkedIn' },
    ]

    return (
        <div className="h-full flex flex-col bg-slate-100/50 dark:bg-[#0a0a0f] relative overflow-hidden">
            {/* Subtle dot pattern background */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
                    backgroundSize: '16px 16px',
                }}
            />

            {/* Top Controls Row */}
            <div className="relative z-10 flex items-center justify-between px-2 py-1.5 shrink-0">
                {/* Mode Toggle */}
                <div className="flex items-center gap-0.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setStudioMode('static')}
                        className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all",
                            studioMode === 'static'
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "text-slate-500"
                        )}
                    >
                        <ImageIcon className="w-3 h-3" />
                        <span>Static</span>
                    </button>
                    <button
                        onClick={() => setStudioMode('gif')}
                        className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all",
                            studioMode === 'gif'
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "text-slate-500"
                        )}
                    >
                        <Film className="w-3 h-3" />
                        <span>GIF</span>
                    </button>
                </div>

                {/* Platform Selector */}
                <div className="flex items-center gap-0.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {platforms.map((p) => {
                        const Icon = p.icon
                        const isActive = platform === p.id
                        return (
                            <button
                                key={p.id}
                                onClick={() => setPlatform(p.id)}
                                className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all",
                                    isActive
                                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                        : "text-slate-500"
                                )}
                            >
                                <Icon className="w-3 h-3" />
                                <span>{p.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Canvas Area - Properly Centered */}
            <div 
                ref={containerRef} 
                className="flex-1 relative overflow-hidden"
            >
                {/* Centering wrapper */}
                <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ padding: `${padding}px` }}
                >
                    {/* Scaled canvas container */}
                    <div
                        style={{
                            width: scaledWidth,
                            height: scaledHeight,
                        }}
                    >
                        <div
                            id="tweet-canvas"
                            className="shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden"
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                transform: `scale(${finalScale})`,
                                transformOrigin: 'top left',
                                padding: design.padding,
                                ...getBackgroundStyle(design),
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center pointer-events-none">
                                <CardRenderer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
