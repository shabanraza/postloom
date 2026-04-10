import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'

export function PollSection() {
    const {
        tweet,
        setPollEnabled,
        updatePollOption,
        updatePollVotes,
        addPollOption,
        removePollOption,
        setPollDuration,
        setPollShowResults,
    } = useTweetStudioStore()

    const poll = tweet.content.poll

    return (
        <div className="space-y-3">
            {/* Enable Poll */}
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500">Poll</Label>
                <Switch
                    checked={poll?.enabled ?? false}
                    onCheckedChange={setPollEnabled}
                />
            </div>

            {poll?.enabled && (
                <div className="space-y-2">
                    {/* Poll Options */}
                    {poll.options.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2">
                            <Input
                                value={option.text}
                                onChange={(e) => updatePollOption(option.id, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                            />
                            <Input
                                type="number"
                                value={option.votes}
                                onChange={(e) => updatePollVotes(option.id, parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className="w-16 h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md tabular-nums"
                                min={0}
                            />
                            {poll.options.length > 2 && (
                                <button
                                    className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                                    onClick={() => removePollOption(option.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    {poll.options.length < 4 && (
                        <button
                            className="w-full h-8 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-dashed border-slate-200 dark:border-slate-700 rounded-md hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                            onClick={addPollOption}
                        >
                            <Plus className="h-4 w-4" />
                            Add Option
                        </button>
                    )}

                    {/* Duration & Results */}
                    <div className="flex items-center gap-2 pt-1">
                        <Input
                            value={poll.duration}
                            onChange={(e) => setPollDuration(e.target.value)}
                            placeholder="Duration (e.g., 1 day left)"
                            className="flex-1 h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-slate-500">Results</span>
                            <Switch
                                checked={poll.showResults}
                                onCheckedChange={setPollShowResults}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
