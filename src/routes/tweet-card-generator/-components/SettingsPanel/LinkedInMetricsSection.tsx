import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ThumbsUp, MessageSquare, Repeat2, Clock } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'

export function LinkedInMetricsSection() {
    const {
        linkedinMetrics,
        tweet,
        setShowMetrics,
        setReactions,
        setComments,
        setReposts,
        setShowTimestamp,
    } = useTweetStudioStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">Engagement</p>
                <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-muted-foreground">Show</Label>
                    <Switch
                        checked={linkedinMetrics.showMetrics}
                        onCheckedChange={setShowMetrics}
                        className="data-[state=checked]:bg-brand scale-90"
                    />
                </div>
            </div>

            {linkedinMetrics.showMetrics && (
                <div className="grid grid-cols-3 gap-2">
                    {/* Reactions */}
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-brand" />
                            Reactions
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={linkedinMetrics.reactions}
                            onChange={(e) => setReactions(Number(e.target.value))}
                            className="h-8 text-xs bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-brand"
                        />
                    </div>

                    {/* Comments */}
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            Comments
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={linkedinMetrics.comments}
                            onChange={(e) => setComments(Number(e.target.value))}
                            className="h-8 text-xs bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-brand"
                        />
                    </div>

                    {/* Reposts */}
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Repeat2 className="h-3 w-3 text-muted-foreground" />
                            Reposts
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={linkedinMetrics.reposts}
                            onChange={(e) => setReposts(Number(e.target.value))}
                            className="h-8 text-xs bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-brand"
                        />
                    </div>
                </div>
            )}

            {/* Timestamp Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label className="text-xs font-medium text-foreground">Show Timestamp</Label>
                </div>
                <Switch
                    checked={tweet.content.showTimestamp}
                    onCheckedChange={setShowTimestamp}
                    className="data-[state=checked]:bg-brand scale-90"
                />
            </div>
        </div>
    )
}

