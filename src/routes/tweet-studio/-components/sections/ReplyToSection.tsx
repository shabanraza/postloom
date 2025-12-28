import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useTweetStudioStore } from '../../-state'

export function ReplyToSection() {
    const { tweet, setReplyTo } = useTweetStudioStore()
    const isEnabled = !!tweet.content.replyTo

    const handleToggle = (checked: boolean) => {
        if (checked) {
            setReplyTo('elonmusk')
        } else {
            setReplyTo(undefined)
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '')
        setReplyTo(value || undefined)
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Reply Context</p>
                <Switch
                    id="show-reply"
                    checked={isEnabled}
                    onCheckedChange={handleToggle}
                    className="scale-90"
                />
            </div>

            {isEnabled && (
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">@</span>
                    <Input
                        placeholder="replying_to"
                        value={tweet.content.replyTo || ''}
                        onChange={handleUsernameChange}
                        className="h-8 pl-7 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                </div>
            )}
        </div>
    )
}
