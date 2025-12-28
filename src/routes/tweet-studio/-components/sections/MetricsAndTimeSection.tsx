import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, setHours, setMinutes } from 'date-fns'
import { useTweetStudioStore } from '../../-state'

/**
 * Combined Section for Metrics & Time
 * Matches explicit user request: "Header together, content next line, 2x2 grid"
 */
export function MetricsAndTimeSection() {
    const {
        tweet,
        setShowMetrics,
        setReposts,
        setLikes,
        setTimestamp
    } = useTweetStudioStore()

    const { metrics } = tweet

    const hours = Array.from({ length: 12 }, (_, i) => i + 1)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    const currentHour = tweet.content.timestamp.getHours()
    const currentMinute = tweet.content.timestamp.getMinutes()
    const isPM = currentHour >= 12
    const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour

    const handleHourChange = (hour: string) => {
        let newHour = parseInt(hour)
        if (isPM && newHour !== 12) newHour += 12
        if (!isPM && newHour === 12) newHour = 0
        setTimestamp(setHours(tweet.content.timestamp, newHour))
    }

    const handleMinuteChange = (minute: string) => {
        setTimestamp(setMinutes(tweet.content.timestamp, parseInt(minute)))
    }

    const handlePeriodChange = (period: string) => {
        let newHour = currentHour
        if (period === 'PM' && currentHour < 12) {
            newHour = currentHour + 12
        } else if (period === 'AM' && currentHour >= 12) {
            newHour = currentHour - 12
        }
        setTimestamp(setHours(tweet.content.timestamp, newHour))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Metrics & Time</p>
                <Switch
                    id="show-metrics"
                    checked={metrics.showMetrics}
                    onCheckedChange={setShowMetrics}
                    className="scale-90"
                />
            </div>

            {metrics.showMetrics && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {/* Row 1: Likes | Retweets */}
                <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Likes</Label>
                    <Input
                        type="text"
                        value={metrics.likes}
                        onChange={(e) => setLikes(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg tabular-nums focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Retweets</Label>
                    <Input
                        type="text"
                        value={metrics.reposts}
                        onChange={(e) => setReposts(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg tabular-nums focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                </div>

                {/* Row 2: Date | Time */}
                <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-8 px-2 justify-start text-left text-xs font-normal bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                            >
                                <span className="truncate">{format(tweet.content.timestamp, "MMM d, yyyy")}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={tweet.content.timestamp}
                                onSelect={(date) => date && setTimestamp(date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-1">
                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Time</Label>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                            <Select value={displayHour.toString()} onValueChange={handleHourChange}>
                                <SelectTrigger className="flex-1 h-8 px-1.5 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500">
                                    <SelectValue placeholder="Hr" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hours.map((h) => (
                                        <SelectItem key={h} value={h.toString()}>{h}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={currentMinute.toString()} onValueChange={handleMinuteChange}>
                                <SelectTrigger className="flex-1 h-8 px-1.5 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500">
                                    <SelectValue placeholder="Min" />
                                </SelectTrigger>
                                <SelectContent>
                                    {minutes.map((m) => (
                                        <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, '0')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Select value={isPM ? 'PM' : 'AM'} onValueChange={handlePeriodChange}>
                            <SelectTrigger size="sm" className="w-full h-8 px-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500">
                                <SelectValue className="text-center" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
