import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Heart, MessageCircle, Repeat2, Clock } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'

export function ThreadsMetricsSection() {
    const {
        threadsMetrics,
        tweet,
        setShowMetrics,
        setLikes,
        setReplies,
        setReposts,
        setShowTimestamp,
    } = useTweetStudioStore()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Engagement</p>
                <div className="flex items-center gap-2">
                    <Label className="text-[10px] text-slate-500">Show</Label>
                    <Switch
                        checked={threadsMetrics.showMetrics}
                        onCheckedChange={setShowMetrics}
                        className="data-[state=checked]:bg-blue-500 scale-90"
                    />
                </div>
            </div>

            {threadsMetrics.showMetrics && (
                <div className="grid grid-cols-3 gap-2">
                    {/* Likes */}
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            Likes
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={threadsMetrics.likes}
                            onChange={(e) => setLikes(Number(e.target.value))}
                            className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Replies */}
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-slate-500" />
                            Replies
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={threadsMetrics.replies}
                            onChange={(e) => setReplies(Number(e.target.value))}
                            className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Reposts */}
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Repeat2 className="h-3 w-3 text-slate-500" />
                            Reposts
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={threadsMetrics.reposts}
                            onChange={(e) => setReposts(Number(e.target.value))}
                            className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Timestamp Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <Label className="text-xs font-medium text-slate-700 dark:text-slate-200">Show Timestamp</Label>
                </div>
                <Switch
                    checked={tweet.content.showTimestamp}
                    onCheckedChange={setShowTimestamp}
                    className="data-[state=checked]:bg-blue-500 scale-90"
                />
            </div>
        </div>
    )
}

