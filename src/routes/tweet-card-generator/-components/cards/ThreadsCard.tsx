import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTweetStudioStore } from '../../-state'
import { AnimatedText } from '../AnimatedText'

function formatNumber(num: number): string {
    if (!num || num === 0) return ''
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

// Get card max-width based on canvas size
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

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ThreadsCard() {
    const tweet = useTweetStudioStore((state) => state.tweet)
    const profile = useTweetStudioStore((state) => state.profile)
    const threadsMetrics = useTweetStudioStore((state) => state.threadsMetrics)
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

    // Threads uses primarily white/light theme with subtle grays
    const themeStyles = {
        light: { bg: 'bg-white', text: 'text-black', subtext: 'text-[#999999]', border: 'border-[#DBDBDB]' },
        dark: { bg: 'bg-[#101010]', text: 'text-white', subtext: 'text-[#777777]', border: 'border-[#333333]' },
        dim: { bg: 'bg-[#1A1A1A]', text: 'text-white', subtext: 'text-[#888888]', border: 'border-[#2C2C2C]' },
    }[theme]

    // Shadow styles
    const shadowIntensity = design.shadowIntensity || 50
    const intensityMultiplier = shadowIntensity / 50

    const getShadowStyle = (): string => {
        if (design.shadow === 'none') return 'none'
        if (design.shadow === 'hard') return '8px 8px 0 0 #000'
        if (design.shadow === 'glow') {
            const opacity = 0.5 * intensityMultiplier
            return `0 0 ${20 * intensityMultiplier}px rgba(0, 0, 0, ${opacity})`
        }
        const blur = design.shadow === 'soft' ? 6 : 15
        return `0 ${4 * intensityMultiplier}px ${blur * intensityMultiplier}px -1px rgba(0, 0, 0, ${0.08 * intensityMultiplier})`
    }

    const fontSizeMultiplier = design.fontSizeMultiplier || 1.0
    const baseFontSize = Math.max(16, 16 * fontScale * fontSizeMultiplier)
    const avatarSize = Math.max(44, 44 * fontScale)
    const iconSize = Math.max(22, 22 * fontScale)
    const padding = Math.max(16, 16 * fontScale)
    const gap = Math.max(12, 12 * fontScale)
    const smallGap = Math.max(6, 6 * fontScale)

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
                    borderRadius: design.borderRadius || 20,
                    boxShadow: getShadowStyle(),
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    padding: padding,
                    ...(design.backgroundType === 'glass' ? {
                        background: theme === 'dark' ? 'rgba(16, 16, 16, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    } : {}),
                }}
            >
                {/* Header */}
                <div className="flex items-start" style={{ gap: gap, marginBottom: gap }}>
                    <Avatar
                        className="rounded-full ring-1 ring-black/5"
                        style={{ width: avatarSize, height: avatarSize }}
                    >
                        <AvatarImage src={profile.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                            {profile.displayName?.[0]?.toUpperCase() || 'T'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center" style={{ gap: smallGap }}>
                                <span
                                    className={cn("font-semibold truncate", themeStyles.text)}
                                    style={{ fontSize: baseFontSize * 0.9375 }}
                                >
                                    {profile.username}
                                </span>
                                {profile.verified && (
                                    <svg viewBox="0 0 24 24" className="text-[#0095F6] fill-current" style={{ width: iconSize * 0.7, height: iconSize * 0.7 }}>
                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.4 14.6l-4.2-4.2 1.4-1.4 2.8 2.8 6.4-6.4 1.4 1.4-7.8 7.8z" />
                                    </svg>
                                )}
                            </div>
                            {content.showTimestamp && (
                                <span className={themeStyles.subtext} style={{ fontSize: baseFontSize * 0.875 }}>
                                    {formatTimeAgo(content.timestamp)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Three dots menu */}
                    <div className={cn("cursor-pointer", themeStyles.subtext)}>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: iconSize, height: iconSize }}>
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="6" cy="12" r="1.5" />
                            <circle cx="18" cy="12" r="1.5" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div
                    className={cn("whitespace-pre-wrap", themeStyles.text)}
                    style={{
                        fontSize: baseFontSize,
                        lineHeight: 1.45,
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
                            cursorColor="#000000"
                        />
                    </span>
                </div>

                {/* Metrics */}
                {threadsMetrics.showMetrics && (
                    <div className="flex items-center" style={{ gap: gap * 1.5 }}>
                        {/* Like */}
                        <div className={cn("flex items-center cursor-pointer", themeStyles.subtext)} style={{ gap: smallGap }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {threadsMetrics.likes > 0 && (
                                <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(threadsMetrics.likes)}</span>
                            )}
                        </div>

                        {/* Comment */}
                        <div className={cn("flex items-center cursor-pointer", themeStyles.subtext)} style={{ gap: smallGap }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            {threadsMetrics.replies > 0 && (
                                <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(threadsMetrics.replies)}</span>
                            )}
                        </div>

                        {/* Repost */}
                        <div className={cn("flex items-center cursor-pointer", themeStyles.subtext)} style={{ gap: smallGap }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                <path d="M17 1l4 4-4 4" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <path d="M7 23l-4-4 4-4" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                            {threadsMetrics.reposts > 0 && (
                                <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(threadsMetrics.reposts)}</span>
                            )}
                        </div>

                        {/* Share */}
                        <div className={cn("flex items-center cursor-pointer", themeStyles.subtext)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: iconSize, height: iconSize }}>
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

