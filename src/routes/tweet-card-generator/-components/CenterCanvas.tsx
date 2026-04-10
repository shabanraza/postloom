import { useRef, useEffect, useState } from 'react'
import { useTweetStudioStore } from '../-state'
import { TweetCard } from './TweetCard'
import { cn } from '@/lib/utils'
import { Image as ImageIcon, Film } from 'lucide-react'
import type { DesignSettings } from '../-types'

// Helper to generate background styles based on type
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
            // Glass mode: show a nice gradient background so the frosted card is visible
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

export function CenterCanvas() {
    const design = useTweetStudioStore((state) => state.design)
    const exportSettings = useTweetStudioStore((state) => state.export)
    const studioMode = useTweetStudioStore((state) => state.studioMode) || 'static'
    const setStudioMode = useTweetStudioStore((state) => state.setStudioMode)

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

    const width = exportSettings.width
    const height = exportSettings.height

    // Calculate scale to fit container
    const margin = 100
    const availableWidth = Math.max(0, containerSize.width - 80)
    const availableHeight = Math.max(0, containerSize.height - margin - 40)

    // Auto scale - cap at 0.6 for smaller preview
    const scaleX = availableWidth / width
    const scaleY = availableHeight / height
    const fitScale = Math.min(scaleX, scaleY, 0.6)

    const finalScale = fitScale > 0 ? fitScale : 0.4

    return (
        <div className="flex-1 h-full overflow-hidden relative flex flex-col bg-slate-50/50 dark:bg-[#0f1117] backdrop-blur-3xl">
            {/* Matrix/Dot Pattern Background for Workspace Area */}
            <div className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    opacity: 0.25
                }}
            />

            {/* Top Center Bar - Studio Mode Toggle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-full shadow-soft-sm border border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setStudioMode('static')}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                        studioMode === 'static'
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Static Post</span>
                </button>
                <button
                    onClick={() => setStudioMode('gif')}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                        studioMode === 'gif'
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    <Film className="w-3.5 h-3.5" />
                    <span>GIF Post</span>
                </button>
            </div>

            {/* Main Canvas Area */}
            <div ref={containerRef} className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden">
                {/* Canvas Wrapper */}
                <div
                    id="tweet-canvas"
                    className="relative shrink-0 transition-transform duration-300 ease-out shadow-2xl flex items-center justify-center overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10"
                    style={{
                        width: width,
                        height: height,
                        transform: `scale(${finalScale})`,
                        padding: design.padding,
                        ...getBackgroundStyle(design),
                    }}
                >
                    {/* The Tweet Card itself */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                        <TweetCard />
                    </div>
                </div>

                {/* Dimensions Badge */}
                <div className="fixed bottom-6 right-[380px] z-50 bg-slate-800/80 text-white text-[10px] font-mono px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none border border-white/10">
                    {width} x {height} · {Math.round(finalScale * 100)}%
                </div>
            </div>
        </div>
    )
}
