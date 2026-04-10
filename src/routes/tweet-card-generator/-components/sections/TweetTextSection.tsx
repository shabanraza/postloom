import { useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useTweetStudioStore } from '../../-state'
import { LIMITS } from '../../-constants'
import { cn } from '../../-utils'
import { EmojiPicker } from '../EmojiPicker'

export function TweetTextSection() {
    const { tweet, setTweetText } = useTweetStudioStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const charCount = tweet.content.text.length
    const maxChars = LIMITS.tweetText
    const remaining = maxChars - charCount

    const handleEmojiSelect = (emoji: string) => {
        const textarea = textareaRef.current
        if (!textarea) {
            setTweetText(tweet.content.text + emoji)
            return
        }

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = tweet.content.text
        const newText = text.slice(0, start) + emoji + text.slice(end)
        
        setTweetText(newText)
        
        // Set cursor position after emoji
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + emoji.length, start + emoji.length)
        }, 0)
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500">Text</Label>
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
            <div className="relative">
                <Textarea
                    ref={textareaRef}
                    placeholder="What's happening?"
                    value={tweet.content.text}
                    onChange={(e) => setTweetText(e.target.value)}
                    maxLength={maxChars}
                    className={cn(
                        "min-h-[100px] resize-y text-sm leading-relaxed p-2.5",
                        "bg-transparent border-slate-200 dark:border-slate-700",
                        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400",
                        "rounded-md focus-visible:ring-1 focus-visible:ring-blue-500",
                        "break-words"
                    )}
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                    }}
                />
                <span className={cn(
                    'absolute bottom-2 right-2 text-[10px] tabular-nums pointer-events-none',
                    remaining <= 20 ? 'text-red-500 font-medium' : 'text-slate-400'
                )}>
                    {remaining}
                </span>
            </div>
        </div>
    )
}
