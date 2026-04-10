import { cn } from '@/lib/utils'
import type { PollData } from '../-types'

interface PollDisplayProps {
    poll: PollData
    theme: 'light' | 'dark' | 'dim'
    gap: number
    baseFontSize: number
}

export function PollDisplay({ poll, theme, gap, baseFontSize }: PollDisplayProps) {
    if (!poll.enabled) return null

    const themeStyles = {
        light: {
            barBg: 'bg-slate-100',
            barFill: 'bg-blue-500',
            text: 'text-slate-900',
            subtext: 'text-slate-500',
            border: 'border-slate-200',
        },
        dark: {
            barBg: 'bg-slate-800',
            barFill: 'bg-blue-500',
            text: 'text-white',
            subtext: 'text-slate-400',
            border: 'border-slate-700',
        },
        dim: {
            barBg: 'bg-slate-700',
            barFill: 'bg-blue-500',
            text: 'text-white',
            subtext: 'text-slate-400',
            border: 'border-slate-600',
        },
    }[theme]

    // Find the winning option
    const maxVotes = Math.max(...poll.options.map((o) => o.votes))

    return (
        <div 
            className="space-y-2" 
            style={{ marginBottom: gap }}
        >
            {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 
                    ? Math.round((option.votes / poll.totalVotes) * 100) 
                    : 0
                const isWinner = option.votes === maxVotes && poll.showResults && poll.totalVotes > 0

                return (
                    <div
                        key={option.id}
                        className={cn(
                            'relative rounded-lg overflow-hidden border',
                            themeStyles.border
                        )}
                        style={{ 
                            padding: `${gap * 0.5}px ${gap * 0.75}px`,
                        }}
                    >
                        {/* Background bar */}
                        {poll.showResults && (
                            <div
                                className={cn(
                                    'absolute inset-0 transition-all duration-300',
                                    isWinner ? themeStyles.barFill : themeStyles.barBg,
                                    isWinner ? 'opacity-30' : 'opacity-50'
                                )}
                                style={{ 
                                    width: `${percentage}%`,
                                }}
                            />
                        )}

                        {/* Content */}
                        <div className="relative flex items-center justify-between">
                            <span 
                                className={cn(
                                    'font-medium',
                                    themeStyles.text,
                                    isWinner && 'font-semibold'
                                )}
                                style={{ fontSize: baseFontSize * 0.9 }}
                            >
                                {option.text}
                            </span>
                            {poll.showResults && (
                                <span 
                                    className={cn(
                                        'font-medium tabular-nums',
                                        isWinner ? themeStyles.text : themeStyles.subtext
                                    )}
                                    style={{ fontSize: baseFontSize * 0.85 }}
                                >
                                    {percentage}%
                                </span>
                            )}
                        </div>
                    </div>
                )
            })}

            {/* Poll footer */}
            <div 
                className={cn('flex items-center justify-between', themeStyles.subtext)}
                style={{ 
                    fontSize: baseFontSize * 0.8,
                    marginTop: gap * 0.5,
                }}
            >
                <span>
                    {poll.totalVotes.toLocaleString()} vote{poll.totalVotes !== 1 ? 's' : ''}
                </span>
                <span>{poll.duration}</span>
            </div>
        </div>
    )
}

