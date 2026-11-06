import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTweetStudioStore } from '../../-state'
import type { TweetCardTheme } from '../../-types'
import { cn } from '../../-utils'

export function TweetThemeSection() {
    const { tweet, setTweetTheme } = useTweetStudioStore()

    const themes: { value: TweetCardTheme; label: string; bg: string; text: string; border: string }[] = [
        { value: 'light', label: 'Light', bg: 'bg-card', text: 'text-foreground', border: 'border-border' },
        { value: 'dark', label: 'Dark', bg: 'bg-[#000000]', text: 'text-white', border: 'border-slate-800' },
        { value: 'dim', label: 'Dim', bg: 'bg-[#15202B]', text: 'text-white', border: 'border-slate-700' },
    ]

    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Theme</Label>

            <RadioGroup
                value={tweet.theme}
                onValueChange={(value) => setTweetTheme(value as TweetCardTheme)}
                className="grid grid-cols-3 gap-2"
            >
                {themes.map((theme) => (
                    <Label
                        key={theme.value}
                        htmlFor={`theme-${theme.value}`}
                        className={cn(
                            'relative flex flex-col items-center gap-1.5 rounded-md p-2 cursor-pointer transition-all duration-200 border',
                            tweet.theme === theme.value
                                ? 'bg-muted dark:bg-[#333] border-brand/50 shadow-inner-soft'
                                : 'bg-muted/50 dark:bg-[#2b2b2b] border-transparent hover:border-foreground/20'
                        )}
                    >
                        <div className={cn(
                            'w-full aspect-video rounded flex items-center justify-center border',
                            theme.bg, theme.border
                        )}>
                            <span className={cn('text-[8px] font-bold', theme.text)}>Aa</span>
                        </div>
                        <RadioGroupItem
                            value={theme.value}
                            id={`theme-${theme.value}`}
                            className="sr-only"
                        />
                        <span className="text-[10px] font-medium text-muted-foreground">{theme.label}</span>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    )
}
