import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTweetStudioStore } from '../../-state'
import { AnimatedText } from '../AnimatedText'

function formatNumber(num: number): string {
    if (!num || num === 0) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

function getCardMaxWidth(canvasWidth: number, canvasHeight: number): number {
    const isVertical = canvasHeight > canvasWidth
    if (canvasWidth === 1080 && canvasHeight === 1080) return 860
    if (canvasWidth === 1080 && canvasHeight === 1350) return 860
    if (canvasWidth === 1080 && canvasHeight === 1920) return 950
    if (canvasWidth === 1200 && canvasHeight === 627) return 960
    if (canvasWidth === 1600 && canvasHeight === 900) return 1280
    if (canvasWidth === 1280 && canvasHeight === 720) return 1024
    return Math.min(canvasWidth * (isVertical ? 0.85 : 0.8), 1280)
}

function getFontScale(canvasWidth: number, canvasHeight: number): number {
    const isVertical = canvasHeight > canvasWidth
    const verticalBoost = isVertical ? 0.5 : 0
    if (canvasWidth >= 1600) return 1.6 + verticalBoost
    if (canvasWidth >= 1200) return 1.5 + verticalBoost
    return 1.4 + verticalBoost
}

function formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    if (diffWeeks < 4) return `${diffWeeks}w`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function LinkedInCard() {
    const tweet = useTweetStudioStore((state) => state.tweet)
    const profile = useTweetStudioStore((state) => state.profile)
    const linkedinMetrics = useTweetStudioStore((state) => state.linkedinMetrics)
    const animation = useTweetStudioStore((state) => state.animation)
    const design = useTweetStudioStore((state) => state.design)
    const exportSettings = useTweetStudioStore((state) => state.export)

    const { theme, content } = tweet

    const canvasWidth = exportSettings.width
    const canvasHeight = exportSettings.height

    const baseCardMaxWidth = getCardMaxWidth(canvasWidth, canvasHeight)
    const cardScale = design.cardScale || 1
    const cardMaxWidth = baseCardMaxWidth * cardScale

    const fontScale = getFontScale(canvasWidth, canvasHeight)

    // LinkedIn uses a professional, clean design
    const themeStyles = {
        light: { bg: 'bg-white', text: 'text-[#191919]', subtext: 'text-[#666666]', border: 'border-[#E0E0E0]', link: 'text-[#0A66C2]' },
        dark: { bg: 'bg-[#1D2226]', text: 'text-white', subtext: 'text-[#B0B0B0]', border: 'border-[#38434F]', link: 'text-[#70B5F9]' },
        dim: { bg: 'bg-[#1B1F23]', text: 'text-[#E7E9EA]', subtext: 'text-[#8B98A5]', border: 'border-[#38444D]', link: 'text-[#70B5F9]' },
    }[theme]

    const shadowIntensity = design.shadowIntensity || 50
    const intensityMultiplier = shadowIntensity / 50

    const getShadowStyle = (): string => {
        if (design.shadow === 'none') return 'none'
        if (design.shadow === 'hard') return '8px 8px 0 0 #000'
        if (design.shadow === 'glow') {
            const opacity = 0.4 * intensityMultiplier
            return `0 0 ${20 * intensityMultiplier}px rgba(10, 102, 194, ${opacity})`
        }
        const blur = design.shadow === 'soft' ? 6 : 15
        return `0 ${4 * intensityMultiplier}px ${blur * intensityMultiplier}px -1px rgba(0, 0, 0, ${0.1 * intensityMultiplier})`
    }

    const fontSizeMultiplier = design.fontSizeMultiplier || 1.0
    const baseFontSize = Math.max(16, 16 * fontScale * fontSizeMultiplier)
    const avatarSize = Math.max(48, 48 * fontScale)
    const iconSize = Math.max(20, 20 * fontScale)
    const padding = Math.max(16, 16 * fontScale)
    const gap = Math.max(12, 12 * fontScale)
    const smallGap = Math.max(4, 4 * fontScale)

    return (
        <div
            className="flex flex-col items-center"
            style={{ width: cardMaxWidth, fontSize: baseFontSize }}
        >
            <div
                className={cn(
                    "w-full transition-colors border relative",
                    design.backgroundType !== 'glass' && themeStyles.bg,
                    themeStyles.border
                )}
                style={{
                    borderRadius: design.borderRadius || 8,
                    boxShadow: getShadowStyle(),
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                    padding: padding,
                    ...(design.backgroundType === 'glass' ? {
                        background: theme === 'dark' ? 'rgba(29, 34, 38, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    } : {}),
                }}
            >
                {/* Header */}
                <div className="flex items-start" style={{ gap: gap, marginBottom: gap }}>
                    <Avatar
                        className="rounded-full ring-1 ring-black/10"
                        style={{ width: avatarSize, height: avatarSize }}
                    >
                        <AvatarImage src={profile.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-[#0A66C2] text-white font-semibold">
                            {profile.displayName?.[0]?.toUpperCase() || 'L'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center" style={{ gap: smallGap }}>
                            <span
                                className={cn("font-semibold", themeStyles.text)}
                                style={{ fontSize: baseFontSize * 0.9375 }}
                            >
                                {profile.displayName}
                            </span>
                            {profile.verified && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A66C2] text-white font-medium">
                                    ✓
                                </span>
                            )}
                        </div>
                        <div
                            className={cn("line-clamp-1", themeStyles.subtext)}
                            style={{ fontSize: baseFontSize * 0.8125 }}
                        >
                            {profile.headline || 'Professional Title'}
                            {profile.company && ` at ${profile.company}`}
                        </div>
                        <div
                            className={cn("flex items-center", themeStyles.subtext)}
                            style={{ fontSize: baseFontSize * 0.75, gap: smallGap, marginTop: smallGap * 0.5 }}
                        >
                            {content.showTimestamp && (
                                <>
                                    <span>{formatTimeAgo(content.timestamp)}</span>
                                    <span>•</span>
                                </>
                            )}
                            {/* Globe icon for public */}
                            <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: iconSize * 0.65, height: iconSize * 0.65 }}>
                                <path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0l.38.19a.5.5 0 00.68-.22l.56-1.12a.75.75 0 01.67-.45h.44a5 5 0 01-1.83 7.26z" />
                            </svg>
                        </div>
                    </div>

                    {/* Three dots menu */}
                    <div className={cn("cursor-pointer p-1 rounded hover:bg-black/5", themeStyles.subtext)}>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: iconSize, height: iconSize }}>
                            <path d="M14 12a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0zM24 12a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div
                    className={cn("whitespace-pre-wrap", themeStyles.text)}
                    style={{
                        fontSize: baseFontSize * 0.9375,
                        lineHeight: 1.5,
                        marginBottom: gap,
                    }}
                >
                    <span className="break-words" data-tweet-text>
                        <AnimatedText
                            text={content.text}
                            animationType={animation.type}
                            active={animation.enabled}
                            speed={animation.speed}
                            showCursor={animation.showCursor}
                            loop={animation.loop}
                            delay={animation.delay}
                            cursorColor="#0A66C2"
                        />
                    </span>
                </div>

                {/* Reactions Row */}
                {linkedinMetrics.showMetrics && (
                    <>
                        <div 
                            className={cn("flex items-center justify-between border-b pb-2", themeStyles.border)}
                            style={{ marginBottom: smallGap * 2 }}
                        >
                            {/* Reaction icons */}
                            <div className="flex items-center" style={{ gap: smallGap }}>
                                <div className="flex -space-x-1">
                                    {/* Like (blue) */}
                                    <div className="w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center ring-2 ring-white">
                                        <svg viewBox="0 0 16 16" fill="white" className="w-2.5 h-2.5">
                                            <path d="M4 8.87L6.58 14h2.49l2.15-5.13H8.5V4h-2L4 8.87z" />
                                        </svg>
                                    </div>
                                    {/* Celebrate (green) */}
                                    <div className="w-5 h-5 rounded-full bg-[#44712E] flex items-center justify-center ring-2 ring-white">
                                        <span className="text-[10px]">👏</span>
                                    </div>
                                    {/* Love (red) */}
                                    <div className="w-5 h-5 rounded-full bg-[#B24020] flex items-center justify-center ring-2 ring-white">
                                        <span className="text-[10px]">❤️</span>
                                    </div>
                                </div>
                                <span className={themeStyles.subtext} style={{ fontSize: baseFontSize * 0.8125 }}>
                                    {formatNumber(linkedinMetrics.reactions)}
                                </span>
                            </div>

                            {/* Comments & Reposts count */}
                            <div className={cn("flex items-center", themeStyles.subtext)} style={{ gap: gap, fontSize: baseFontSize * 0.8125 }}>
                                {linkedinMetrics.comments > 0 && (
                                    <span>{formatNumber(linkedinMetrics.comments)} comments</span>
                                )}
                                {linkedinMetrics.reposts > 0 && (
                                    <span>{formatNumber(linkedinMetrics.reposts)} reposts</span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center">
                            {/* Like */}
                            <button className={cn("flex items-center gap-2 px-4 py-2 rounded hover:bg-black/5 transition-colors", themeStyles.subtext)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                                <span style={{ fontSize: baseFontSize * 0.8125, fontWeight: 600 }}>Like</span>
                            </button>

                            {/* Comment */}
                            <button className={cn("flex items-center gap-2 px-4 py-2 rounded hover:bg-black/5 transition-colors", themeStyles.subtext)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span style={{ fontSize: baseFontSize * 0.8125, fontWeight: 600 }}>Comment</span>
                            </button>

                            {/* Repost */}
                            <button className={cn("flex items-center gap-2 px-4 py-2 rounded hover:bg-black/5 transition-colors", themeStyles.subtext)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                    <path d="M17 1l4 4-4 4" />
                                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                    <path d="M7 23l-4-4 4-4" />
                                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                                </svg>
                                <span style={{ fontSize: baseFontSize * 0.8125, fontWeight: 600 }}>Repost</span>
                            </button>

                            {/* Send */}
                            <button className={cn("flex items-center gap-2 px-4 py-2 rounded hover:bg-black/5 transition-colors", themeStyles.subtext)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                <span style={{ fontSize: baseFontSize * 0.8125, fontWeight: 600 }}>Send</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

