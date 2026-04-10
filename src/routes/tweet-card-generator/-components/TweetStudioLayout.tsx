import { useEffect, useState, useCallback } from 'react'
import { TopBar } from './TopBar'
import { IconSidebar, type PanelType } from './IconSidebar'
import { ExpandablePanel } from './ExpandablePanel'
import { PreviewPanel } from './PreviewPanel'
import { ThemeToggle } from './ThemeToggle'
import { OnboardingOverlay } from './OnboardingOverlay'
import { MobileCanvasLayout } from './MobileCanvasLayout'
import { trackToolOpen, trackToolClose } from '@/lib/analytics'

/**
 * Main Layout for Postloom - Canva-Style
 * 
 * Layout Structure:
 * - Icon Sidebar (56px) on the left with 4 icons
 * - Expandable Panel (320px) slides out when icon is clicked
 * - Preview Panel fills remaining space with:
 *   - Mode toggle (Static/GIF) at TOP
 *   - Large canvas in CENTER
 *   - Platform selector at BOTTOM
 */
export function TweetStudioLayout() {
    const [isMobile, setIsMobile] = useState(false)
    const [activePanel, setActivePanel] = useState<PanelType>('content')

    // Track tool open/close for session analytics
    useEffect(() => {
        trackToolOpen()
        
        const handleUnload = () => trackToolClose()
        window.addEventListener('beforeunload', handleUnload)
        
        return () => {
            window.removeEventListener('beforeunload', handleUnload)
            trackToolClose()
        }
    }, [])

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Keyboard shortcuts for panel switching
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return
            }

            const panelMap: Record<string, PanelType> = {
                '1': 'content',
                '2': 'design',
                '3': 'background',
                '4': 'animation',
                '5': 'brandkit',
            }

            if (panelMap[e.key]) {
                e.preventDefault()
                setActivePanel((current) => 
                    current === panelMap[e.key] ? null : panelMap[e.key]
                )
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handlePanelChange = useCallback((panel: PanelType) => {
        setActivePanel(panel)
    }, [])

    const handlePanelClose = useCallback(() => {
        setActivePanel(null)
    }, [])

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-[#0a0a0f] overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Onboarding Overlay for new users */}
            <OnboardingOverlay />

            {/* Top Bar */}
            <TopBar />

            {/* Main Workspace Area */}
            <main className="flex flex-1 overflow-hidden relative">
                {/* Desktop: Canva-style layout */}
                {!isMobile && (
                    <>
                        {/* Icon Sidebar - Always visible */}
                        <IconSidebar 
                            activePanel={activePanel} 
                            onPanelChange={handlePanelChange} 
                        />

                        {/* Expandable Panel - Shows when icon is clicked */}
                        <ExpandablePanel 
                            activePanel={activePanel} 
                            onClose={handlePanelClose} 
                        />

                        {/* Preview Panel - Fills remaining space */}
                        <PreviewPanel />
                    </>
                )}

                {/* Mobile: Canva-style split layout */}
                {isMobile && (
                    <MobileCanvasLayout />
                )}
            </main>
        </div>
    )
}

export { ThemeToggle }
