import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, setHours, setMinutes } from 'date-fns'
import { useTweetStudioStore } from '../../-state'

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
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500">Metrics & Time</Label>
                <Switch
                    checked={metrics.showMetrics}
                    onCheckedChange={setShowMetrics}
                />
            </div>

            {metrics.showMetrics && (
                <div className="space-y-3">
                    {/* Likes & Retweets */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Likes</Label>
                            <Input
                                type="text"
                                value={metrics.likes}
                                onChange={(e) => setLikes(parseInt(e.target.value) || 0)}
                                className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md tabular-nums focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Retweets</Label>
                            <Input
                                type="text"
                                value={metrics.reposts}
                                onChange={(e) => setReposts(parseInt(e.target.value) || 0)}
                                className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md tabular-nums focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Date - Full Width */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-8 px-3 justify-start text-left text-sm font-normal bg-transparent border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md"
                                >
                                    {format(tweet.content.timestamp, "MMMM d, yyyy")}
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

                    {/* Time - Full Width with proper sizing */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Time</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Select value={displayHour.toString()} onValueChange={handleHourChange}>
                                <SelectTrigger className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md">
                                    <SelectValue placeholder="Hr" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hours.map((h) => (
                                        <SelectItem key={h} value={h.toString()}>{h}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={currentMinute.toString()} onValueChange={handleMinuteChange}>
                                <SelectTrigger className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md">
                                    <SelectValue placeholder="Min" />
                                </SelectTrigger>
                                <SelectContent>
                                    {minutes.map((m) => (
                                        <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, '0')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={isPM ? 'PM' : 'AM'} onValueChange={handlePeriodChange}>
                                <SelectTrigger className="h-8 text-sm font-medium bg-transparent border-slate-200 dark:border-slate-700 rounded-md">
                                    <SelectValue />
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
