import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTweetStudioStore } from '../../-state'
import { LIMITS } from '../../-constants'

export function LinkedInProfileSection() {
    const {
        profile,
        setDisplayName,
        setAvatarUrl,
        setHeadline,
        setCompany,
    } = useTweetStudioStore()

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold text-foreground">Profile</p>

            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="shrink-0 relative group">
                    <Avatar className="h-14 w-14 rounded-full bg-brand/10 ring-1 ring-border/5 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                        <AvatarImage src={profile.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-brand/10 text-brand font-bold text-lg rounded-full">
                            {profile.displayName?.[0]?.toUpperCase() || 'L'}
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
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Full Name</Label>
                        <Input
                            placeholder="John Doe"
                            value={profile.displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength={LIMITS.displayName}
                            className="h-8 text-xs bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-brand"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Headline</Label>
                        <Input
                            placeholder="Software Engineer"
                            value={profile.headline || ''}
                            onChange={(e) => setHeadline(e.target.value)}
                            maxLength={120}
                            className="h-8 text-xs bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-brand"
                        />
                    </div>
                </div>
            </div>

            {/* Company */}
            <div className="space-y-1">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Company</Label>
                <Input
                    placeholder="Google"
                    value={profile.company || ''}
                    onChange={(e) => setCompany(e.target.value)}
                    maxLength={60}
                    className="h-8 text-xs bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-brand"
                />
            </div>
        </div>
    )
}

