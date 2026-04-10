import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500">Reply To</Label>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={handleToggle}
                />
            </div>

            {isEnabled && (
                <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                    <Input
                        placeholder="username"
                        value={tweet.content.replyTo || ''}
                        onChange={handleUsernameChange}
                        className="h-8 pl-6 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                </div>
            )}
        </div>
    )
}
