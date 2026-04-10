import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTweetStudioStore } from '../../-state'

export function QuoteTweetSection() {
    const {
        tweet,
        setQuoteTweetEnabled,
        setQuoteTweetProfile,
        setQuoteTweetText,
        setQuoteTweetMedia,
    } = useTweetStudioStore()

    const quotedTweet = tweet.quotedTweet

    return (
        <div className="space-y-3">
            {/* Enable Quote Tweet */}
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500">Quote Tweet</Label>
                <Switch
                    checked={quotedTweet?.enabled ?? false}
                    onCheckedChange={setQuoteTweetEnabled}
                />
            </div>

            {quotedTweet?.enabled && (
                <div className="space-y-3">
                    {/* Profile Row */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Name</Label>
                            <Input
                                value={quotedTweet.profile.displayName}
                                onChange={(e) => setQuoteTweetProfile({ displayName: e.target.value })}
                                placeholder="Name"
                                className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Handle</Label>
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                                <Input
                                    value={quotedTweet.profile.username}
                                    onChange={(e) => setQuoteTweetProfile({ 
                                        username: e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '') 
                                    })}
                                    placeholder="username"
                                    className="h-8 text-sm pl-6 bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar & Verified */}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-slate-500">Avatar URL</Label>
                            <Input
                                value={quotedTweet.profile.avatarUrl || ''}
                                onChange={(e) => setQuoteTweetProfile({ avatarUrl: e.target.value || undefined })}
                                placeholder="https://..."
                                className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                            />
                        </div>
                        <div className="flex items-center gap-2 h-8 px-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <span className="text-xs text-slate-500">✓</span>
                            <Switch
                                checked={quotedTweet.profile.verified}
                                onCheckedChange={(checked) => setQuoteTweetProfile({ verified: checked })}
                            />
                        </div>
                    </div>

                    {/* Quote Tweet Text */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Content</Label>
                        <div className="relative">
                            <Textarea
                                value={quotedTweet.text}
                                onChange={(e) => setQuoteTweetText(e.target.value)}
                                placeholder="Original tweet..."
                                className="min-h-[70px] text-sm resize-none bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                                maxLength={280}
                            />
                            <span className="absolute bottom-2 right-2 text-xs text-slate-400 tabular-nums">
                                {quotedTweet.text.length}/280
                            </span>
                        </div>
                    </div>

                    {/* Media URL */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Media URL</Label>
                        <Input
                            value={quotedTweet.mediaUrl || ''}
                            onChange={(e) => setQuoteTweetMedia(e.target.value || undefined)}
                            placeholder="Image URL (optional)"
                            className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
