import { TopBar } from './TopBar'
import { LeftPanel } from './LeftPanel'
import { CenterCanvas } from './CenterCanvas'
import { RightPanel } from './RightPanel'
import { ThemeToggle } from './ThemeToggle'

/**
 * Main Layout for Postloom
 * Implements the "Soft Dashboard" aesthetic:
 * - Global soft gray/slate-50 background
 * - Sections float as distinct elements
 * - Clean separation of concerns
 */
export function TweetStudioLayout() {
    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-[#0f1117] overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Top Bar - Floating header with glassmorphism effect */}
            <TopBar />

            {/* Main Workspace Area */}
            <main className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Navigation & Content */}
                <LeftPanel />

                {/* Center Stage - The "Canvas" */}
                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                    <CenterCanvas />
                </div>

                {/* Right Sidebar - Design Controls */}
                <RightPanel />
            </main>

        </div>
    )
}

export { ThemeToggle }
