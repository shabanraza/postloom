import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BadgeCheck } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { LIMITS } from '../../-constants'

export function ProfileSection() {
    const {
        tweet,
        setDisplayName,
        setUsername,
        setAvatarUrl,
        setVerified
    } = useTweetStudioStore()

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '')
        setUsername(value)
    }

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Profile</p>

            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="shrink-0 relative group">
                    <Avatar className="h-14 w-14 rounded-lg bg-orange-200 ring-1 ring-black/5 dark:ring-white/10 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                        <AvatarImage src={tweet.profile.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-orange-200 text-orange-700 font-bold text-lg rounded-lg">
                            {tweet.profile.displayName?.[0]?.toUpperCase() || 'T'}
                        </AvatarFallback>
                    </Avatar>
                    <Input
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title="Paste avatar URL"
                        onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                </div>

                {/* Inputs Stack */}
                <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Display Name</Label>
                        <Input
                            placeholder="Name"
                            value={tweet.profile.displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength={LIMITS.displayName}
                            className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Handle</Label>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">@</span>
                            <Input
                                placeholder="username"
                                value={tweet.profile.username}
                                onChange={handleUsernameChange}
                                maxLength={LIMITS.username}
                                className="h-8 pl-6 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Verified Badge Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Label className="text-xs font-medium text-slate-700 dark:text-slate-200">Verified Badge</Label>
                    <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
                </div>
                <Switch
                    id="verified"
                    checked={tweet.profile.verified}
                    onCheckedChange={setVerified}
                    className="data-[state=checked]:bg-blue-500 scale-90"
                />
            </div>
        </div>
    )
}
