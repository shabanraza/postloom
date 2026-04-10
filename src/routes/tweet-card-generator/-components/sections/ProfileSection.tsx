import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTweetStudioStore } from '../../-state'
import { LIMITS } from '../../-constants'

export function ProfileSection() {
    const {
        tweet,
        setDisplayName,
        setUsername,
        setAvatarUrl,
        setBadgeType
    } = useTweetStudioStore()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9_]/g, '')
        setUsername(value)
    }

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setAvatarUrl(url)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                {/* Avatar with upload */}
                <div className="shrink-0 relative group">
                    <Avatar className="h-12 w-12 rounded-lg bg-orange-200 cursor-pointer">
                        <AvatarImage src={tweet.profile.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-orange-200 text-orange-700 font-bold text-base rounded-lg">
                            {tweet.profile.displayName?.[0]?.toUpperCase() || 'T'}
                        </AvatarFallback>
                    </Avatar>
                    {/* Upload overlay */}
                    <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                        <Camera className="w-5 h-5 text-white" />
                    </label>
                    <input
                        ref={fileInputRef}
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                </div>

                {/* Inputs */}
                <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Name</Label>
                        <Input
                            placeholder="Name"
                            value={tweet.profile.displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength={LIMITS.displayName}
                            className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Handle</Label>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">@</span>
                            <Input
                                placeholder="username"
                                value={tweet.profile.username}
                                onChange={handleUsernameChange}
                                maxLength={LIMITS.username}
                                className="h-8 pl-6 text-sm bg-transparent border-slate-200 dark:border-slate-700 rounded-md focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Verified Badge Row */}
            <div className="space-y-2">
                <Label className="text-xs text-slate-500">Badge</Label>
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => setBadgeType('none')}
                        className={cn(
                            "h-9 px-3 text-xs font-medium rounded-lg border transition-all",
                            tweet.profile.badgeType === 'none' || !tweet.profile.badgeType
                                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                                : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                    >
                        None
                    </button>
                    <button
                        onClick={() => setBadgeType('blue')}
                        className={cn(
                            "h-9 px-3 rounded-lg border flex items-center justify-center transition-all",
                            tweet.profile.badgeType === 'blue'
                                ? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700"
                                : "bg-transparent border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1D9BF0] fill-current">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.71 2.79 1.957 3.468-.085.43-.13.87-.13 1.33 0 2.21 1.71 4.002 3.818 4.002.47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.866.252 1.336.252 2.11 0 3.818-1.792 3.818-4.002 0-.46-.045-.9-.13-1.33 1.25-.678 1.958-2.033 1.958-3.468zM9.998 15.035l-3.37-3.37 1.41-1.41 1.96 1.96 4.64-4.64 1.41 1.41-6.05 6.05z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => setBadgeType('gold')}
                        className={cn(
                            "h-9 px-3 rounded-lg border flex items-center justify-center transition-all",
                            tweet.profile.badgeType === 'gold'
                                ? "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-700"
                                : "bg-transparent border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#F4AF16] fill-current">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.71 2.79 1.957 3.468-.085.43-.13.87-.13 1.33 0 2.21 1.71 4.002 3.818 4.002.47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.866.252 1.336.252 2.11 0 3.818-1.792 3.818-4.002 0-.46-.045-.9-.13-1.33 1.25-.678 1.958-2.033 1.958-3.468zM9.998 15.035l-3.37-3.37 1.41-1.41 1.96 1.96 4.64-4.64 1.41 1.41-6.05 6.05z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => setBadgeType('gray')}
                        className={cn(
                            "h-9 px-3 rounded-lg border flex items-center justify-center transition-all",
                            tweet.profile.badgeType === 'gray'
                                ? "bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-500"
                                : "bg-transparent border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#6B7280] fill-current">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.435.71 2.79 1.957 3.468-.085.43-.13.87-.13 1.33 0 2.21 1.71 4.002 3.818 4.002.47 0 .92-.086 1.336-.252.62 1.335 1.926 2.25 3.437 2.25 1.512 0 2.818-.915 3.437-2.25.415.166.866.252 1.336.252 2.11 0 3.818-1.792 3.818-4.002 0-.46-.045-.9-.13-1.33 1.25-.678 1.958-2.033 1.958-3.468zM9.998 15.035l-3.37-3.37 1.41-1.41 1.96 1.96 4.64-4.64 1.41 1.41-6.05 6.05z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
