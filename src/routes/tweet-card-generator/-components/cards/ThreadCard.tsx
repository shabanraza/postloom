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

export function ThreadCard() {
    const tweet = useTweetStudioStore((state) => state.tweet)
    const design = useTweetStudioStore((state) => state.design)
    const animation = useTweetStudioStore((state) => state.animation)
    const exportSettings = useTweetStudioStore((state) => state.export)

    const { profile, theme, thread, metrics } = tweet
    const threadItems = thread?.items || []
    const showConnector = thread?.showConnector ?? true

    const canvasWidth = exportSettings.width
    const canvasHeight = exportSettings.height
    const cardMaxWidth = getCardMaxWidth(canvasWidth, canvasHeight)
    const fontScale = design.fontSizeMultiplier || 1

    const baseFontSize = Math.min(
        Math.max(canvasWidth * 0.016 * fontScale, 14),
        24
    )
    const gap = baseFontSize * 0.8
    const smallGap = gap * 0.5
    const iconSize = baseFontSize * 1.2
    const avatarSize = baseFontSize * 2.5

    const themeStyles = {
        light: {
            bg: 'bg-white',
            text: 'text-slate-900',
            subtext: 'text-slate-500',
            border: 'border-slate-200',
            connector: 'bg-slate-300',
        },
        dark: {
            bg: 'bg-black',
            text: 'text-white',
            subtext: 'text-slate-400',
            border: 'border-slate-800',
            connector: 'bg-slate-700',
        },
        dim: {
            bg: 'bg-[#15202B]',
            text: 'text-white',
            subtext: 'text-slate-400',
            border: 'border-slate-700',
            connector: 'bg-slate-600',
        },
    }[theme]

    const getBadgeColor = () => {
        switch (profile.badgeType) {
            case 'gold': return 'text-[#F4AF16]'
            case 'gray': return 'text-[#6B7280]'
            default: return 'text-[#1D9BF0]'
        }
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden',
                themeStyles.bg
            )}
            style={{
                width: '100%',
                maxWidth: cardMaxWidth,
                borderRadius: design.borderRadius,
                fontFamily: design.fontFamily,
                padding: gap * 1.5,
            }}
        >
            {threadItems.map((item, index) => (
                <div key={item.id} className="relative">
                    {/* Connector line */}
                    {showConnector && index < threadItems.length - 1 && (
                        <div
                            className={cn('absolute left-0 w-0.5', themeStyles.connector)}
                            style={{
                                left: avatarSize / 2 - 1,
                                top: avatarSize + smallGap,
                                bottom: -gap,
                            }}
                        />
                    )}

                    <div
                        className="flex"
                        style={{
                            gap: gap,
                            marginBottom: index < threadItems.length - 1 ? gap * 1.5 : 0,
                        }}
                    >
                        {/* Avatar */}
                        <div className="shrink-0">
                            <Avatar
                                className="ring-2 ring-black/5"
                                style={{
                                    width: avatarSize,
                                    height: avatarSize,
                                }}
                            >
                                <AvatarImage src={profile.avatarUrl} className="object-cover" />
                                <AvatarFallback
                                    className="bg-blue-500 text-white font-bold"
                                    style={{ fontSize: baseFontSize * 0.8 }}
                                >
                                    {profile.displayName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center" style={{ gap: smallGap, marginBottom: smallGap }}>
                                <span
                                    className={cn('font-bold truncate', themeStyles.text)}
                                    style={{ fontSize: baseFontSize * 0.9375 }}
                                >
                                    {profile.displayName}
                                </span>
                                {profile.verified && profile.badgeType !== 'none' && (
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-label="Verified account"
                                        className={cn('fill-current shrink-0', getBadgeColor())}
                                        style={{ width: iconSize * 0.9, height: iconSize * 0.9 }}
                                    >
                                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.71 2.79 1.957 3.468-.085.43-.13.87-.13 1.33 0 2.21 1.71 4.002 3.818 4.002.47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.866.252 1.336.252 2.11 0 3.818-1.792 3.818-4.002 0-.46-.045-.9-.13-1.33 1.25-.678 1.958-2.033 1.958-3.468zM9.998 15.035l-3.37-3.37 1.41-1.41 1.96 1.96 4.64-4.64 1.41 1.41-6.05 6.05z"/>
                                    </svg>
                                )}
                                <span className={cn('truncate', themeStyles.subtext)} style={{ fontSize: baseFontSize * 0.875 }}>
                                    @{profile.username}
                                </span>
                            </div>

                            {/* Tweet text */}
                            <div
                                className={cn('whitespace-pre-wrap break-words', themeStyles.text)}
                                style={{
                                    fontSize: baseFontSize,
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word',
                                }}
                            >
                                <span data-tweet-text>
                                    <AnimatedText
                                        text={item.text}
                                        animationType={index === 0 ? animation.type : 'none'}
                                        active={index === 0 && animation.enabled}
                                        speed={animation.speed}
                                        showCursor={animation.showCursor}
                                        loop={animation.loop}
                                        delay={animation.delay}
                                        cursorColor="#1DA1F2"
                                    />
                                </span>
                            </div>

                            {/* Media */}
                            {item.mediaUrl && (
                                <div
                                    className="overflow-hidden rounded-xl border border-black/5 dark:border-white/10"
                                    style={{ marginTop: smallGap }}
                                >
                                    <img
                                        src={item.mediaUrl}
                                        alt="Tweet media"
                                        className="w-full h-auto object-cover"
                                        style={{ maxHeight: 200 * fontScale }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Show metrics on last tweet only */}
            {metrics.showMetrics && (
                <div
                    className={cn('flex items-center justify-around border-t pt-3 mt-3', themeStyles.border)}
                    style={{ paddingLeft: avatarSize + gap }}
                >
                    {/* Reply */}
                    <div className={cn('flex items-center', themeStyles.subtext)} style={{ gap: smallGap }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: iconSize, height: iconSize }}>
                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
                        </svg>
                        <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(metrics.replies)}</span>
                    </div>
                    {/* Repost */}
                    <div className={cn('flex items-center', themeStyles.subtext)} style={{ gap: smallGap }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: iconSize, height: iconSize }}>
                            <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V19H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V5h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 16.62V9.25c0-.97-.784-1.75-1.75-1.75z"/>
                        </svg>
                        <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(metrics.reposts)}</span>
                    </div>
                    {/* Like */}
                    <div className={cn('flex items-center', themeStyles.subtext)} style={{ gap: smallGap }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: iconSize, height: iconSize }}>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z"/>
                        </svg>
                        <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(metrics.likes)}</span>
                    </div>
                    {/* Views */}
                    <div className={cn('flex items-center', themeStyles.subtext)} style={{ gap: smallGap }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: iconSize, height: iconSize }}>
                            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21v-5.5h2V21H4zM13 21v-9h2v9h-2z"/>
                        </svg>
                        <span style={{ fontSize: baseFontSize * 0.875 }}>{formatNumber(metrics.views)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

