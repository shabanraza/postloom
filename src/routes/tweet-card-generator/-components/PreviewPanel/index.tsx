import { useRef, useEffect, useState } from 'react'
import { useTweetStudioStore } from '../../-state'
import { CardRenderer } from '../cards'
import { PlatformSelector } from './PlatformSelector'
import { ModeToggle } from './ModeToggle'
import type { DesignSettings } from '../../-types'

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

export function PreviewPanel() {
    const design = useTweetStudioStore((state) => state.design)
    const exportSettings = useTweetStudioStore((state) => state.export)

    const containerRef = useRef<HTMLDivElement>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [isMobile, setIsMobile] = useState(false)

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

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

    // Calculate scale to fit container - adjust for mobile
    const margin = isMobile ? 16 : 40
    const availableWidth = Math.max(0, containerSize.width - margin * 2)
    const availableHeight = Math.max(0, containerSize.height - margin * 2)

    // Auto scale - larger on desktop, fit-to-screen on mobile
    const scaleX = availableWidth / width
    const scaleY = availableHeight / height
    const maxScale = isMobile ? 1 : 0.85
    const fitScale = Math.min(scaleX, scaleY, maxScale)

    const finalScale = fitScale > 0 ? fitScale : 0.3

    return (
        <div className="flex-1 h-full overflow-hidden relative flex flex-col bg-slate-100/50 dark:bg-[#0a0a0f]">
            {/* Subtle dot pattern background */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20"
                style={{
                    backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Mode Toggle - TOP */}
            <div className="relative z-50 pt-2 sm:pt-4 pb-1 sm:pb-2 flex justify-center shrink-0">
                <ModeToggle />
            </div>

            {/* Main Canvas Area - FILLS REMAINING SPACE */}
            <div 
                ref={containerRef} 
                className="flex-1 w-full relative flex items-center justify-center overflow-hidden px-2 sm:px-0"
            >
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
                    {/* The Card itself - renders based on platform */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                        <CardRenderer />
                    </div>
                </div>

                {/* Dimensions Badge - Positioned near canvas */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-800/80 text-white text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg backdrop-blur-sm pointer-events-none border border-white/10">
                    {width} × {height} · {Math.round(finalScale * 100)}%
                </div>
            </div>

            {/* Platform Selector - BOTTOM */}
            <div className="relative z-50 pb-16 sm:pb-4 pt-1 sm:pt-2 flex justify-center shrink-0">
                <PlatformSelector />
            </div>
        </div>
    )
}
