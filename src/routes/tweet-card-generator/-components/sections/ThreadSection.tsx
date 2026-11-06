import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'

export function ThreadSection() {
    const {
        tweet,
        addThreadItem,
        removeThreadItem,
        updateThreadItem,
        updateThreadItemMedia,
        setThreadConnector,
    } = useTweetStudioStore()

    const thread = tweet.thread
    const items = thread?.items || []

    return (
        <div className="space-y-3">
            {/* Header with connector toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                    Thread ({items.length}/10)
                </Label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Connector</span>
                    <Switch
                        checked={thread?.showConnector ?? true}
                        onCheckedChange={setThreadConnector}
                    />
                </div>
            </div>

            {/* Thread Items */}
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="mt-2 text-xs font-bold text-muted-foreground w-4 shrink-0">
                                {index + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                                <div className="relative">
                                    <Textarea
                                        value={item.text}
                                        onChange={(e) => updateThreadItem(item.id, e.target.value)}
                                        placeholder={`Tweet ${index + 1}...`}
                                        className="min-h-[60px] text-sm resize-none bg-transparent border-border rounded-md"
                                        maxLength={280}
                                    />
                                    <span className="absolute bottom-2 right-2 text-xs text-muted-foreground tabular-nums">
                                        {item.text.length}/280
                                    </span>
                                </div>
                                <Input
                                    placeholder="Image URL (optional)"
                                    value={item.mediaUrl || ''}
                                    onChange={(e) => updateThreadItemMedia(item.id, e.target.value || undefined)}
                                    className="h-8 text-sm bg-transparent border-border rounded-md"
                                />
                            </div>
                            {items.length > 2 && (
                                <button
                                    className="mt-2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                    onClick={() => removeThreadItem(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Tweet Button */}
                {items.length < 10 && (
                    <button
                        className="w-full h-8 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-md hover:border-foreground/20 transition-colors"
                        onClick={addThreadItem}
                    >
                        <Plus className="h-4 w-4" />
                        Add Tweet
                    </button>
                )}
            </div>
        </div>
    )
}
