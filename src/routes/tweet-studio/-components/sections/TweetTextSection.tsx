import { Textarea } from '@/components/ui/textarea'
import { useTweetStudioStore } from '../../-state'
import { LIMITS } from '../../-constants'
import { cn } from '../../-utils'

export function TweetTextSection() {
    const { tweet, setTweetText } = useTweetStudioStore()
    const charCount = tweet.content.text.length
    const maxChars = LIMITS.tweetText
    const remaining = maxChars - charCount

    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Tweet Text</p>
            <div className="relative">
                <Textarea
                    placeholder="What's happening?"
                    value={tweet.content.text}
                    onChange={(e) => setTweetText(e.target.value)}
                    maxLength={maxChars}
                    className={cn(
                        "min-h-[120px] resize-y text-sm leading-relaxed p-3",
                        "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
                        "text-slate-900 dark:text-slate-100 placeholder:text-slate-500",
                        "rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500",
                        "break-words",
                        "[field-sizing:content]"
                    )}
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                    }}
                />

                <div className="absolute bottom-2 right-2 pointer-events-none">
                    <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-slate-200 dark:border-slate-600 tabular-nums',
                        remaining <= 20 ? 'text-red-500 font-bold' : 'text-slate-500'
                    )}>
                        {remaining}
                    </span>
                </div>
            </div>
        </div>
    )
}
