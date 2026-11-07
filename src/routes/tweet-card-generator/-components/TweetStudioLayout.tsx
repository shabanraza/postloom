import { useEffect, useState, useCallback } from 'react'
import { TopBar } from './TopBar'
import { IconSidebar, type PanelType } from './IconSidebar'
import { ExpandablePanel } from './ExpandablePanel'
import { PreviewPanel } from './PreviewPanel'
import { ThemeToggle } from './ThemeToggle'
import { GuidedTour, useFirstVisitTour } from './GuidedTour'
import { ShortcutsDialog, isShortcutsKey } from './ShortcutsDialog'
import { startHistoryRecording, useTweetStudioStore } from '../-state/tweet-studio-store'
import { useEditorUi } from '../-state/editor-ui'
import { isTypingTarget } from '../-utils'
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
    useFirstVisitTour()

    // Undo/Redo history fills itself as the post or design changes
    useEffect(() => startHistoryRecording(), [])

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
            // Leave typing (and the browser's own text undo) alone
            if (isTypingTarget(e.target)) return
            // While a dialog or the tour is open, keys belong to it
            if (document.querySelector('[role="dialog"]')) return

            const mod = e.metaKey || e.ctrlKey
            if (mod && e.key.toLowerCase() === 'z') {
                e.preventDefault()
                const { undo, redo } = useTweetStudioStore.getState()
                if (e.shiftKey) redo()
                else undo()
                return
            }
            if (mod && e.key.toLowerCase() === 'y') {
                e.preventDefault()
                useTweetStudioStore.getState().redo()
                return
            }
            if (mod || e.altKey) return

            if (isShortcutsKey(e)) {
                e.preventDefault()
                useEditorUi.getState().setShortcutsOpen(true)
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
        <div data-clarity-mask="true" className="flex h-screen w-full flex-col bg-muted/50 dark:bg-[#0a0a0f] overflow-hidden text-foreground font-sans transition-colors duration-300">
            {/* First-visit tour (also from Help) and the shortcuts list */}
            <GuidedTour />
            <ShortcutsDialog />

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
