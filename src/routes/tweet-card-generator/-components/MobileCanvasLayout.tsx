import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Link, X, FileText, Sparkles, Image, Wand2, Palette } from 'lucide-react'
import { MobilePreview } from './MobilePreview'
import { ImportUrlSection } from './SettingsPanel/ImportUrlSection'
import { ProfileSection, TweetTextSection, MetricsAndTimeSection, ReplyToSection, PollSection, CardTypeSelector } from './sections'
import { LinkedInProfileSection } from './SettingsPanel/LinkedInProfileSection'
import { ThreadsMetricsSection } from './SettingsPanel/ThreadsMetricsSection'
import { LinkedInMetricsSection } from './SettingsPanel/LinkedInMetricsSection'
import { QuickPresetsTab } from './tabs/QuickPresetsTab'
import { BackgroundTab } from './tabs/BackgroundTab'
import { AnimationTab } from './tabs/AnimationTab'
import { BrandKit } from './BrandKit'
import { useTweetStudioStore } from '../-state'
import { cn } from '@/lib/utils'

type TabType = 'content' | 'design' | 'background' | 'animation' | 'brandkit'

const tabs: { id: TabType; label: string; icon: typeof FileText }[] = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'design', label: 'Design', icon: Sparkles },
    { id: 'background', label: 'Background', icon: Image },
    { id: 'animation', label: 'Animation', icon: Wand2 },
    { id: 'brandkit', label: 'Brand Kit', icon: Palette },
]

function ContentTabContent() {
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
        <div className="space-y-4">
            <ImportUrlSection />
            
            {/* Card Type - Twitter only */}
            {platform === 'twitter' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <CardTypeSelector />
                </>
            )}
            
            {/* Profile */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
            {platform === 'linkedin' ? (
                <LinkedInProfileSection />
            ) : (
                <ProfileSection />
            )}

            {/* Text */}
            {cardType !== 'thread' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <TweetTextSection />
                </>
            )}

            {/* Media Upload */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
            <div className="space-y-2">
                <Label className="text-xs text-slate-500">Media</Label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="mobile-canvas-media-upload"
                />

                {mediaUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                            src={mediaUrl}
                            alt="Preview"
                            className="w-full h-20 object-cover"
                        />
                        <button
                            onClick={handleRemoveMedia}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <label
                            htmlFor="mobile-canvas-media-upload"
                            className="flex items-center justify-center gap-2 h-10 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Upload image</span>
                        </label>
                        <div className="relative">
                            <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input
                                placeholder="Or paste URL..."
                                value={mediaUrl || ''}
                                onChange={(e) => setMediaUrl(e.target.value || undefined)}
                                className="h-8 pl-8 text-xs bg-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Poll - Twitter only */}
            {platform === 'twitter' && cardType === 'single' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <PollSection />
                </>
            )}

            {/* Metrics */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
            {platform === 'twitter' && <MetricsAndTimeSection />}
            {platform === 'threads' && <ThreadsMetricsSection />}
            {platform === 'linkedin' && <LinkedInMetricsSection />}

            {/* Reply - Twitter only */}
            {platform === 'twitter' && cardType !== 'thread' && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                    <ReplyToSection />
                </>
            )}
        </div>
    )
}

export function MobileCanvasLayout() {
    const [activeTab, setActiveTab] = useState<TabType>('content')

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950">
            {/* Canvas Section - Fixed height */}
            <div className="h-[40%] shrink-0 border-b border-slate-200 dark:border-slate-800">
                <MobilePreview />
            </div>
            
            {/* Controls Section */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900">
                {/* Horizontal Scrolling Tabs - Canva Style */}
                <div className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                                        isActive 
                                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" 
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tab Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-3 pb-6">
                    {activeTab === 'content' && <ContentTabContent />}
                    {activeTab === 'design' && <QuickPresetsTab />}
                    {activeTab === 'background' && <BackgroundTab />}
                    {activeTab === 'animation' && <AnimationTab />}
                    {activeTab === 'brandkit' && <BrandKit />}
                </div>
            </div>
        </div>
    )
}
