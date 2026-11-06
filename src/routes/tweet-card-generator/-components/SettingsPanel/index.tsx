import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Brush, Image, Film } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { ContentTab } from './ContentTab'
import { DesignTab } from './DesignTab'
import { BackgroundTab } from '../tabs/BackgroundTab'
import { AnimationTab } from '../tabs/AnimationTab'

export function SettingsPanel() {
    const studioMode = useTweetStudioStore((state) => state.studioMode)
    const [activeTab, setActiveTab] = useState('content')

    // Automatically switch to Animation tab when GIF mode is selected
    useEffect(() => {
        if (studioMode === 'gif') {
            setActiveTab('animation')
        } else if (studioMode === 'static' && activeTab === 'animation') {
            setActiveTab('content')
        }
    }, [studioMode, activeTab])

    return (
        <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-border/60 bg-transparent z-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
                <TabsList className="mx-3 mt-3 mb-2 shrink-0 grid w-auto grid-cols-4 h-10 p-1 bg-card rounded-xl shadow-soft-sm border border-border">
                    <TabsTrigger
                        value="content"
                        className="rounded-lg text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <FileText className="h-3 w-3" />
                        <span>Content</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="design"
                        className="rounded-lg text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <Brush className="h-3 w-3" />
                        <span>Design</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="background"
                        className="rounded-lg text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <Image className="h-3 w-3" />
                        <span>Background</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="animation"
                        className="rounded-lg text-[10px] gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <Film className="h-3 w-3" />
                        <span>Animation</span>
                    </TabsTrigger>
                </TabsList>

                {/* Scrollable Tab Content */}
                <div className="flex-1 overflow-y-auto px-3 pb-6">
                    <TabsContent value="content" className="m-0 py-3">
                        <ContentTab />
                    </TabsContent>

                    <TabsContent value="design" className="m-0 py-3">
                        <DesignTab />
                    </TabsContent>

                    <TabsContent value="background" className="m-0 py-3">
                        <BackgroundTab />
                    </TabsContent>

                    <TabsContent value="animation" className="m-0 py-3">
                        <AnimationTab />
                    </TabsContent>
                </div>
            </Tabs>
        </aside>
    )
}

