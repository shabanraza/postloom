import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { QuotedTweet, TweetCardTheme } from '../-types'

interface QuoteTweetDisplayProps {
    quotedTweet: QuotedTweet
    theme: TweetCardTheme
    gap: number
    baseFontSize: number
    fontScale: number
}

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function QuoteTweetDisplay({ 
    quotedTweet, 
    theme, 
    gap, 
    baseFontSize,
    fontScale 
}: QuoteTweetDisplayProps) {
    if (!quotedTweet.enabled) return null

    const { profile, text, timestamp, mediaUrl } = quotedTweet
    const smallGap = gap * 0.5
    const avatarSize = baseFontSize * 1.5

    const themeStyles = {
        light: {
            bg: 'bg-slate-50',
            text: 'text-slate-900',
            subtext: 'text-slate-500',
            border: 'border-slate-200',
        },
        dark: {
            bg: 'bg-slate-900/50',
            text: 'text-white',
            subtext: 'text-slate-400',
            border: 'border-slate-700',
        },
        dim: {
            bg: 'bg-slate-800/50',
            text: 'text-white',
            subtext: 'text-slate-400',
            border: 'border-slate-600',
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
                'rounded-xl border overflow-hidden',
                themeStyles.bg,
                themeStyles.border
            )}
            style={{ 
                marginBottom: gap,
                padding: gap * 0.75,
            }}
        >
            {/* Header */}
            <div className="flex items-center" style={{ gap: smallGap, marginBottom: smallGap }}>
                <Avatar style={{ width: avatarSize, height: avatarSize }}>
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {profile.displayName?.[0]?.toUpperCase() || 'Q'}
                    </AvatarFallback>
                </Avatar>
                <span
                    className={cn('font-bold', themeStyles.text)}
                    style={{ fontSize: baseFontSize * 0.8 }}
                >
                    {profile.displayName}
                </span>
                {profile.verified && profile.badgeType !== 'none' && (
                    <svg
                        viewBox="0 0 24 24"
                        className={cn('fill-current', getBadgeColor())}
                        style={{ width: baseFontSize * 0.8, height: baseFontSize * 0.8 }}
                    >
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.71 2.79 1.957 3.468-.085.43-.13.87-.13 1.33 0 2.21 1.71 4.002 3.818 4.002.47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.866.252 1.336.252 2.11 0 3.818-1.792 3.818-4.002 0-.46-.045-.9-.13-1.33 1.25-.678 1.958-2.033 1.958-3.468zM9.998 15.035l-3.37-3.37 1.41-1.41 1.96 1.96 4.64-4.64 1.41 1.41-6.05 6.05z"/>
                    </svg>
                )}
                <span className={themeStyles.subtext} style={{ fontSize: baseFontSize * 0.75 }}>
                    @{profile.username}
                </span>
                <span className={themeStyles.subtext} style={{ fontSize: baseFontSize * 0.75 }}>
                    · {formatTimeAgo(timestamp)}
                </span>
            </div>

            {/* Content */}
            <div
                className={cn('whitespace-pre-wrap break-words', themeStyles.text)}
                style={{
                    fontSize: baseFontSize * 0.85,
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                }}
            >
                {text}
            </div>

            {/* Media */}
            {mediaUrl && (
                <div
                    className="overflow-hidden rounded-lg border border-black/5 dark:border-white/10"
                    style={{ marginTop: smallGap }}
                >
                    <img
                        src={mediaUrl}
                        alt="Quoted tweet media"
                        className="w-full h-auto object-cover"
                        style={{ maxHeight: 150 * fontScale }}
                    />
                </div>
            )}
        </div>
    )
}

