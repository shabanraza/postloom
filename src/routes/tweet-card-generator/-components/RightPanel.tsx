import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brush, Image, Film } from 'lucide-react'
import { useTweetStudioStore } from '../-state'
import {
    QuickPresetsTab,
    BackgroundTab,
    AnimationTab,
} from './tabs'

export function RightPanel() {
    const studioMode = useTweetStudioStore((state) => state.studioMode)
    const [activeTab, setActiveTab] = useState('design')

    // Automatically switch to Animation tab when GIF mode is selected
    useEffect(() => {
        if (studioMode === 'gif') {
            setActiveTab('animation')
        } else if (studioMode === 'static' && activeTab === 'animation') {
            setActiveTab('design')
        }
    }, [studioMode])

    return (
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-border/60 bg-transparent z-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
                <TabsList className="mx-3 mt-3 mb-2 shrink-0 grid w-auto grid-cols-3 h-10 p-1 bg-card rounded-xl shadow-soft-sm border border-border">
                    <TabsTrigger
                        value="design"
                        className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <Brush className="h-3.5 w-3.5" />
                        <span>Design</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="background"
                        className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <Image className="h-3.5 w-3.5" />
                        <span>BG</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="animation"
                        className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
                    >
                        <Film className="h-3.5 w-3.5" />
                        <span>Anim</span>
                    </TabsTrigger>
                </TabsList>

                {/* Scrollable Tab Content */}
                <div className="flex-1 overflow-y-auto px-3 pb-6">
                    <TabsContent value="design" className="m-0 py-4">
                        <QuickPresetsTab />
                    </TabsContent>

                    <TabsContent value="background" className="m-0 py-4">
                        <BackgroundTab />
                    </TabsContent>

                    <TabsContent value="animation" className="m-0 py-4">
                        <AnimationTab />
                    </TabsContent>
                </div>
            </Tabs>
        </aside>
    )
}

