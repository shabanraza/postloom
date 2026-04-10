import { useRef } from 'react'
import { X, Upload, Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImportUrlSection } from './ImportUrlSection'
import { 
    ProfileSection, 
    TweetTextSection, 
    MetricsAndTimeSection, 
    ReplyToSection, 
    PollSection,
    ThreadSection,
    QuoteTweetSection,
    CardTypeSelector,
} from '../sections'
import { useTweetStudioStore } from '../../-state'
import { LinkedInProfileSection } from './LinkedInProfileSection'
import { ThreadsMetricsSection } from './ThreadsMetricsSection'
import { LinkedInMetricsSection } from './LinkedInMetricsSection'
import { cn } from '@/lib/utils'

export function ContentTab() {
    const platform = useTweetStudioStore((state) => state.platform)
    const cardType = useTweetStudioStore((state) => state.tweet.cardType || 'single')
    const mediaUrl = useTweetStudioStore((state) => state.tweet.content.mediaUrl)
    const setMediaUrl = useTweetStudioStore((state) => state.setMediaUrl)
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setMediaUrl(url)
        }
    }

    const handleRemoveMedia = () => {
        setMediaUrl(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-5">
            {/* Import URL Section */}
            <ImportUrlSection />

            {/* Card Type Selector - Twitter only */}
            {platform === 'twitter' && (
                <>
                    <CardTypeSelector />
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                </>
            )}

            {/* Profile Section */}
            {cardType !== 'thread' && (
                <>
                    {platform === 'linkedin' ? (
                        <LinkedInProfileSection />
                    ) : (
                        <ProfileSection />
                    )}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                </>
            )}

            {/* Thread Section - Only for thread card type */}
            {platform === 'twitter' && cardType === 'thread' && (
                <>
                    <ProfileSection />
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <ThreadSection />
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                </>
            )}

            {/* Content Section - Not shown for thread */}
            {cardType !== 'thread' && (
                <>
                    <TweetTextSection />
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                </>
            )}

            {/* Media/Image Section */}
            <div className="space-y-3">
                <Label className="text-xs text-slate-500">Media</Label>
                
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-upload"
                />

                {mediaUrl ? (
                    /* Preview when media is selected */
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                            src={mediaUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="12">Invalid image</text></svg>'
                            }}
                        />
                        <button
                            onClick={handleRemoveMedia}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    /* Upload options when no media */
                    <div className="space-y-2">
                        {/* Upload button */}
                        <label
                            htmlFor="media-upload"
                            className="flex items-center justify-center gap-2 h-20 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                        >
                            <Upload className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-500">Click to upload image</span>
                        </label>
                        
                        {/* URL input */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                            <span className="text-xs text-slate-400">or paste URL</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        </div>
                        
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="https://..."
                                value={mediaUrl || ''}
                                onChange={(e) => setMediaUrl(e.target.value || undefined)}
                                className="h-9 pl-9 text-sm bg-transparent border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Poll Section - Twitter only, single card type */}
            {platform === 'twitter' && cardType === 'single' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <PollSection />
                </>
            )}

            {/* Quote Tweet Section - Twitter only, quote card type */}
            {platform === 'twitter' && cardType === 'quote' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <QuoteTweetSection />
                </>
            )}

            {/* Metrics Section */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
            {platform === 'twitter' && <MetricsAndTimeSection />}
            {platform === 'threads' && <ThreadsMetricsSection />}
            {platform === 'linkedin' && <LinkedInMetricsSection />}

            {/* Reply Section - Twitter only, not for thread */}
            {platform === 'twitter' && cardType !== 'thread' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <ReplyToSection />
                </>
            )}
        </div>
    )
}
