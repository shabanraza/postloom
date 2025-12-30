import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTweetStudioStore } from '../-state'

function formatNumber(num: number): string {
    if (!num || num === 0) return ''
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

// Typewriter Component
function TypewriterText({
    text,
    active,
    speed = 30,
    showCursor = true,
    loop = false,
    delay = 0
}: {
    text: string;
    active: boolean;
    speed?: number;
    showCursor?: boolean;
    loop?: boolean;
    delay?: number;
}) {
    const [display, setDisplay] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [cursorVisible, setCursorVisible] = useState(true)

    useEffect(() => {
        if (!active) {
            setDisplay(text)
            setIsTyping(false)
            return
        }

        let i = 0
        let timer: NodeJS.Timeout
        let loopTimer: NodeJS.Timeout

        const startTyping = () => {
            setDisplay('')
            setIsTyping(true)
            i = 0

            timer = setInterval(() => {
                i++
                setDisplay(text.slice(0, i))

                if (i >= text.length) {
                    clearInterval(timer)
                    setIsTyping(false)

                    if (loop) {
                        loopTimer = setTimeout(startTyping, 2000)
                    }
                }
            }, 1000 / speed)
        }

        const delayTimer = setTimeout(startTyping, delay * 1000)

        return () => {
            clearTimeout(delayTimer)
            clearInterval(timer)
            clearTimeout(loopTimer)
        }
    }, [text, active, speed, loop, delay])

    useEffect(() => {
        if (!active || !showCursor) return
        const interval = setInterval(() => setCursorVisible(v => !v), 530)
        return () => clearInterval(interval)
    }, [active, showCursor])

    if (!active) return <span>{text}</span>

    return (
        <span>
            {display}
            {showCursor && (isTyping || cursorVisible) && (
                <span className="inline-block w-[2px] h-[1em] bg-blue-500 ml-0.5 animate-pulse align-middle" />
            )}
        </span>
    )
}

// Get card max-width based on canvas size - TARGET 80% COVERAGE
function getCardMaxWidth(canvasWidth: number, canvasHeight: number): number {
    // For vertical formats (Reels/Stories), we want the card to be ~80% of width
    const isVertical = canvasHeight > canvasWidth

    // Instagram Post (1080x1080) -> 860px (~80% of 1080)
    if (canvasWidth === 1080 && canvasHeight === 1080) return 860
    // Instagram Portrait (1080x1350) -> 860px (~80%)
    if (canvasWidth === 1080 && canvasHeight === 1350) return 860
    // Instagram Story/Reel (1080x1920) -> 950px (~90% for vertical formats)
    if (canvasWidth === 1080 && canvasHeight === 1920) return 950
    // LinkedIn (1200x627) -> 960px (~80%)
    if (canvasWidth === 1200 && canvasHeight === 627) return 960
    // Twitter/X (1600x900) -> 1280px (~80%)
    if (canvasWidth === 1600 && canvasHeight === 900) return 1280
    // YouTube Thumbnail (1280x720) -> 1024px (~80%)
    if (canvasWidth === 1280 && canvasHeight === 720) return 1024
    // Default: 80% of canvas width for horizontal, 85% for vertical
    return Math.min(canvasWidth * (isVertical ? 0.85 : 0.8), 1280)
}

// Get font scale based on canvas size for readability - INCREASED
function getFontScale(canvasWidth: number, canvasHeight: number): number {
    // For vertical formats (Reels/Stories), boost font scale significantly for readability
    const isVertical = canvasHeight > canvasWidth
    const verticalBoost = isVertical ? 0.5 : 0

    // Base font size scales with canvas width for readability
    // Instagram (1080) -> 1.4x (+ 0.5 for vertical = 1.9x)
    // LinkedIn (1200) -> 1.5x 
    // Twitter (1600) -> 1.6x
    if (canvasWidth >= 1600) return 1.6 + verticalBoost
    if (canvasWidth >= 1200) return 1.5 + verticalBoost
    return 1.4 + verticalBoost
}

export function TweetCard() {
    const tweet = useTweetStudioStore((state) => state.tweet)
    const animation = useTweetStudioStore((state) => state.animation)
    const design = useTweetStudioStore((state) => state.design)
    const exportSettings = useTweetStudioStore((state) => state.export)

    const {
        theme,
        content,
        profile,
        metrics,
    } = tweet

    // Get canvas dimensions
    const canvasWidth = exportSettings.width
    const canvasHeight = exportSettings.height

    // Calculate card max-width based on canvas size (PRD rules) and user scale
    const baseCardMaxWidth = getCardMaxWidth(canvasWidth, canvasHeight)
    const cardScale = design.cardScale || 1
    const cardMaxWidth = baseCardMaxWidth * cardScale

    // Calculate font scale for readability
    const fontScale = getFontScale(canvasWidth, canvasHeight)

    const formatDate = (date: Date) => {
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return `${time} · ${day}`
    }

    const themeStyles = {
        light: { bg: 'bg-white', text: 'text-black', subtext: 'text-[#536471]', border: 'border-slate-100', icon: 'text-[#536471]' },
        dark: { bg: 'bg-black', text: 'text-[#E7E9EA]', subtext: 'text-[#71767B]', border: 'border-[#2F3336]', icon: 'text-[#71767B]' },
        dim: { bg: 'bg-[#15202B]', text: 'text-[#F7F9F9]', subtext: 'text-[#8B98A5]', border: 'border-[#38444D]', icon: 'text-[#8B98A5]' },
    }[theme]

    // Shadow styles based on design.shadow and shadowIntensity
    const shadowIntensity = design.shadowIntensity || 50
    const intensityMultiplier = shadowIntensity / 50 // Normalize to 0-2 range
    
    const getShadowStyle = (): string => {
        const baseShadows: Record<string, string> = {
            none: 'none',
            soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            hard: '8px 8px 0 0 #000',
            glow: '0 0 20px rgba(59, 130, 246, 0.5)',
        }
        
        if (design.shadow === 'none') return 'none'
        if (design.shadow === 'hard') return baseShadows.hard // Hard shadow doesn't scale
        if (design.shadow === 'glow') {
            const opacity = 0.5 * intensityMultiplier
            return `0 0 ${20 * intensityMultiplier}px rgba(59, 130, 246, ${opacity})`
        }
        
        // For soft and medium, scale the blur and spread
        const blur = design.shadow === 'soft' ? 6 : 15
        const spread = design.shadow === 'soft' ? 4 : 6
        return `0 ${4 * intensityMultiplier}px ${blur * intensityMultiplier}px -1px rgba(0, 0, 0, ${0.1 * intensityMultiplier}), 0 ${2 * intensityMultiplier}px ${spread * intensityMultiplier}px -2px rgba(0, 0, 0, ${0.1 * intensityMultiplier})`
    }
    
    const shadowStyle = getShadowStyle()

    // Base sizes that scale with canvas size for readability
    // Minimum 16px font size as requested
    // Apply user-controlled font size multiplier
    const fontSizeMultiplier = design.fontSizeMultiplier || 1.0
    const baseFontSize = Math.max(16, 16 * fontScale * fontSizeMultiplier)
    const avatarSize = Math.max(48, 48 * fontScale)
    const iconSize = Math.max(20, 20 * fontScale)
    const smallIconSize = Math.max(14, 14 * fontScale)
    const padding = Math.max(20, 20 * fontScale)
    const gap = Math.max(14, 14 * fontScale)
    const smallGap = Math.max(6, 6 * fontScale)

    return (
        <div
            className="flex flex-col gap-0 items-center"
            style={{
                width: cardMaxWidth,
                fontSize: baseFontSize,
            }}
        >
            {/* Main Tweet Card */}
            <div
                className={cn(
                    "w-full transition-colors border relative",
                    // Only apply solid bg if not glass mode
                    design.backgroundType !== 'glass' && themeStyles.bg,
                    themeStyles.border
                )}
                style={{
                    borderRadius: design.borderRadius || 16,
                    boxShadow: shadowStyle,
                    fontFamily: design.fontFamily || 'system-ui, sans-serif',
                    padding: padding,
                    // Glass effect: transparent background with blur
                    ...(design.backgroundType === 'glass' ? {
                        background: theme === 'dark'
                            ? 'rgba(0, 0, 0, 0.4)'
                            : theme === 'dim'
                                ? 'rgba(21, 32, 43, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderColor: theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                    } : {}),
                }}
            >
                {/* Header (User Info) */}
                <div
                    className="flex justify-between items-start"
                    style={{ marginBottom: gap }}
                >
                    <div className="flex" style={{ gap: gap }}>
                        <Avatar
                            className="rounded-full border border-black/5 dark:border-white/5"
                            style={{ width: avatarSize, height: avatarSize }}
                        >
                            <AvatarImage src={profile.avatarUrl} className="object-cover" />
                            <AvatarFallback
                                className="font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                style={{ fontSize: baseFontSize * 0.875 }}
                            >
                                {profile.displayName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight justify-center">
                            <div className="flex items-center" style={{ gap: smallGap }}>
                                <span
                                    className={cn("font-bold", themeStyles.text)}
                                    style={{ fontSize: baseFontSize * 0.9375, fontWeight: design.fontWeight || 700 }}
                                >
                                    {profile.displayName}
                                </span>
                                {profile.verified && (
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-label="Verified account"
                                        className="text-[#1D9BF0] fill-current"
                                        style={{ width: iconSize, height: iconSize }}
                                    >
                                        <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.71 2.79 1.957 3.468-.085.43-.13.87-.13 1.33 0 2.21 1.71 4.002 3.818 4.002.47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.866.252 1.336.252 2.11 0 3.818-1.792 3.818-4.002 0-.46-.045-.9-.13-1.33 1.25-.678 1.958-2.033 1.958-3.468zM9.998 15.035l-3.37-3.37 1.41-1.41 1.96 1.96 4.64-4.64 1.41 1.41-6.05 6.05z"></path></g>
                                    </svg>
                                )}
                            </div>
                            <span
                                className={cn("font-normal", themeStyles.subtext)}
                                style={{ fontSize: baseFontSize * 0.9375 }}
                            >
                                @{profile.username}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tweet Body - Main Content */}
                <div
                    className={cn("whitespace-pre-wrap", themeStyles.text)}
                    style={{
                        fontSize: baseFontSize * 1.125, // Slightly larger for readability
                        lineHeight: 1.5,
                        marginBottom: gap,
                    }}
                >
                    <span className="break-words" data-tweet-text style={{ fontWeight: design.fontWeight || 400 }}>
                        <TypewriterText
                            text={content.text}
                            active={animation.enabled && animation.type === 'typewriter'}
                            speed={animation.speed}
                            showCursor={animation.showCursor}
                            loop={animation.loop}
                            delay={animation.delay}
                        />
                    </span>
                </div>

                {/* Timestamp & Meta */}
                {content.showTimestamp && (
                    <div
                        className={cn("border-b font-normal", themeStyles.subtext, themeStyles.border)}
                        style={{
                            fontSize: baseFontSize * 0.9375,
                            paddingBottom: gap,
                            marginBottom: smallGap,
                        }}
                    >
                        {formatDate(content.timestamp)}
                        {metrics.showMetrics && (
                            <> · <span className={themeStyles.text + " font-bold"}>{formatNumber(metrics.views)}</span> <span className="font-normal">Views</span></>
                        )}
                    </div>
                )}
                {!content.showTimestamp && (
                    <div
                        className={cn("border-b", themeStyles.border)}
                        style={{ marginBottom: smallGap }}
                    />
                )}

                {/* Main Metrics Row */}
                {metrics.showMetrics && (
                <div
                    className="flex justify-between items-center"
                    style={{ paddingTop: smallGap }}
                >
                    {/* Reply */}
                    <div className={cn("flex items-center group cursor-pointer", themeStyles.icon)} style={{ gap: smallGap }}>
                        <div
                            className="rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors"
                            style={{ padding: padding * 0.5 }}
                        >
                            <svg viewBox="0 0 24 24" className="fill-current" style={{ width: iconSize, height: iconSize }}>
                                <g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                            </svg>
                        </div>
                        {metrics.replies > 0 && <span className="group-hover:text-[#1D9BF0] tabular-nums" style={{ fontSize: smallIconSize }}>{formatNumber(metrics.replies)}</span>}
                    </div>

                    {/* Retweet */}
                    <div className={cn("flex items-center group cursor-pointer", themeStyles.icon)} style={{ gap: smallGap }}>
                        <div
                            className="rounded-full group-hover:bg-[#00BA7C]/10 group-hover:text-[#00BA7C] transition-colors"
                            style={{ padding: padding * 0.5 }}
                        >
                            <svg viewBox="0 0 24 24" className="fill-current" style={{ width: iconSize, height: iconSize }}>
                                <g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>
                            </svg>
                        </div>
                        {metrics.reposts > 0 && <span className="group-hover:text-[#00BA7C] tabular-nums" style={{ fontSize: smallIconSize }}>{formatNumber(metrics.reposts)}</span>}
                    </div>

                    {/* Like */}
                    <div className={cn("flex items-center group cursor-pointer", themeStyles.icon)} style={{ gap: smallGap }}>
                        <div
                            className="rounded-full group-hover:bg-[#F91880]/10 group-hover:text-[#F91880] transition-colors"
                            style={{ padding: padding * 0.5 }}
                        >
                            <svg viewBox="0 0 24 24" className="fill-current" style={{ width: iconSize, height: iconSize }}>
                                <g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.605 3.01.894 1.81.844 4.17-.518 6.67z"></path></g>
                            </svg>
                        </div>
                        {metrics.likes > 0 && <span className="group-hover:text-[#F91880] tabular-nums" style={{ fontSize: smallIconSize }}>{formatNumber(metrics.likes)}</span>}
                    </div>

                    {/* Views */}
                    <div className={cn("flex items-center group cursor-pointer", themeStyles.icon)} style={{ gap: smallGap }}>
                        <div
                            className="rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors"
                            style={{ padding: padding * 0.5 }}
                        >
                            <svg viewBox="0 0 24 24" className="fill-current" style={{ width: iconSize, height: iconSize }}>
                                <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
                            </svg>
                        </div>
                        {metrics.views > 0 && <span className="group-hover:text-[#1D9BF0] tabular-nums" style={{ fontSize: smallIconSize }}>{formatNumber(metrics.views)}</span>}
                    </div>

                    {/* Bookmark & Share */}
                    <div className="flex items-center" style={{ gap: smallGap }}>
                        <div
                            className={cn("rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors cursor-pointer", themeStyles.icon)}
                            style={{ padding: padding * 0.5 }}
                        >
                            <svg viewBox="0 0 24 24" className="fill-current" style={{ width: iconSize, height: iconSize }}>
                                <g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g>
                            </svg>
                        </div>
                        <div
                            className={cn("rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors cursor-pointer", themeStyles.icon)}
                            style={{ padding: padding * 0.5 }}
                        >
                            <svg viewBox="0 0 24 24" className="fill-current" style={{ width: iconSize, height: iconSize }}>
                                <g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g>
                            </svg>
                        </div>
                    </div>
                </div>
                )}

                {/* Watermark */}
                <div
                    className="absolute bottom-0 right-0 pointer-events-none"
                    style={{
                        padding: padding * 0.6,
                    }}
                >
                    <span
                        className={cn(
                            "text-xs font-medium opacity-40",
                            theme === 'dark' || theme === 'dim' 
                                ? 'text-white' 
                                : 'text-slate-600'
                        )}
                        style={{ fontSize: baseFontSize * 0.7 }}
                    >
                        postloom.com
                    </span>
                </div>
            </div>

            {/* Threaded Reply (if Reply Context active) */}
            {content.replyTo && (
                <div
                    className={cn(
                        "rounded-b-xl border-x border-b relative z-[-1]",
                        themeStyles.bg,
                        themeStyles.border,
                    )}
                    style={{
                        width: '95%',
                        padding: padding,
                        marginTop: -gap * 0.75,
                        paddingTop: gap * 1.5,
                    }}
                >
                    <div className="flex" style={{ gap: gap }}>
                        {/* Line connector */}
                        <div
                            className="absolute bg-[#CFD9DE] dark:bg-[#333639]"
                            style={{
                                left: padding + avatarSize / 2 - 1,
                                top: -gap,
                                bottom: avatarSize + gap,
                                width: 2,
                            }}
                        />

                        <Avatar
                            className="rounded-full z-10"
                            style={{ width: avatarSize, height: avatarSize }}
                        >
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=reply`} />
                            <AvatarFallback>R</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div
                                className="flex items-center"
                                style={{ gap: smallGap, marginBottom: smallGap * 0.5 }}
                            >
                                <span
                                    className={cn("font-bold", themeStyles.text)}
                                    style={{ fontSize: baseFontSize * 0.875 }}
                                >
                                    Random User
                                </span>
                                <span
                                    className={themeStyles.subtext}
                                    style={{ fontSize: baseFontSize * 0.875 }}
                                >
                                    @random_user · 2h
                                </span>
                            </div>
                            <div
                                className={themeStyles.text}
                                style={{ fontSize: baseFontSize * 0.9375, marginTop: smallGap }}
                            >
                                Replying to <span className="text-[#1D9BF0]">@{profile.username}</span>
                            </div>
                            <div
                                className={themeStyles.text}
                                style={{ fontSize: baseFontSize * 0.9375, marginTop: smallGap }}
                            >
                                This is an incredible update! Can't wait to try it out. 🔥
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
