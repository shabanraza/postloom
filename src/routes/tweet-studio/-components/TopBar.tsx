import { useState } from 'react'
import { Undo2, Redo2, RotateCcw, ChevronDown, Download, Image, Film, Loader2, Link2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from './ThemeToggle'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { useTweetStudioStore } from '../-state'
import { EXPORT_SIZES } from '../-constants'
import { exportAsPng, exportAsGif, estimateFileSize } from '../-export'
import { fetchTweetFromUrl } from '../-utils/fetch-tweet'
import { trackTweetImport, trackExport } from '@/lib/analytics'
import { PostloomLogo } from '@/components/PostloomLogo'
import type { ExportPreset } from '../-types'

export function TopBar() {
    const [importUrl, setImportUrl] = useState('')
    const [isImporting, setIsImporting] = useState(false)
    const [importError, setImportError] = useState<string | null>(null)

    const {
        tweet,
        animation,
        undo,
        redo,
        reset,
        export: exportSettings,
        setExportPreset,
        isExporting,
        setIsExporting,
        exportProgress,
        setExportProgress,
        setTweetFromFetched,
    } = useTweetStudioStore()

    const handleImport = async () => {
        if (!importUrl.trim()) {
            setImportError('Please enter a tweet URL')
            return
        }

        setIsImporting(true)
        setImportError(null)

        try {
            const tweet = await fetchTweetFromUrl(importUrl)

            setTweetFromFetched({
                text: tweet.text,
                displayName: tweet.user.name,
                username: tweet.user.screen_name,
                avatarUrl: tweet.user.profile_image_url_https,
                verified: tweet.user.verified,
                likes: tweet.favorite_count,
                reposts: tweet.retweet_count,
                replies: tweet.reply_count,
                views: tweet.views_count,
                timestamp: new Date(tweet.created_at),
            })

            setImportUrl('')
            setImportError(null)
            trackTweetImport(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tweet'
            setImportError(errorMessage)
            trackTweetImport(false, errorMessage)
        } finally {
            setIsImporting(false)
        }
    }

    const handleImportKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleImport()
        }
    }

    const handleExportPng = async () => {
        const canvasElement = document.getElementById('tweet-canvas')
        if (!canvasElement) {
            console.error('Canvas element not found')
            return
        }

        setIsExporting(true)
        setExportProgress(0)

        try {
            // Use actual width/height from exportSettings (set by QuickPresetsTab or preset selection)
            await exportAsPng(canvasElement, tweet.profile.username, {
                width: exportSettings.width,
                height: exportSettings.height,
            })
            trackExport('png', exportSettings.width, exportSettings.height)
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsExporting(false)
            setExportProgress(0)
        }
    }

    const handleExportGif = async () => {
        const canvasElement = document.getElementById('tweet-canvas')
        if (!canvasElement) {
            console.error('Canvas element not found')
            alert('Canvas element not found. Please refresh the page.')
            return
        }

        // Validate text content
        if (!tweet.content.text || tweet.content.text.trim().length === 0) {
            alert('Please enter some text before exporting as GIF')
            return
        }

        setIsExporting(true)
        setExportProgress(0)

        try {
            // Use actual width/height from exportSettings
            await exportAsGif(canvasElement, tweet.profile.username, {
                width: exportSettings.width,
                height: exportSettings.height,
                text: tweet.content.text,
                speed: animation.speed,
                fps: animation.fps,
                loop: animation.loop,
                onProgress: (progress) => setExportProgress(progress * 100),
            })
            trackExport('gif', exportSettings.width, exportSettings.height)
        } catch (error) {
            console.error('GIF export failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            alert(`GIF export failed: ${errorMessage}\n\nIf this persists, try:\n- Reducing the text length\n- Using a smaller export size\n- Refreshing the page`)
        } finally {
            setIsExporting(false)
            setExportProgress(0)
        }
    }

    // Use actual dimensions from export settings
    const estimatedPngSize = estimateFileSize(exportSettings.width, exportSettings.height, 'png')
    const estimatedGifSize = estimateFileSize(
        exportSettings.width,
        exportSettings.height,
        'gif',
        tweet.content.text.length,
        animation.fps
    )

    return (
        <TooltipProvider delayDuration={300}>
            <header className="grid grid-cols-3 h-16 shrink-0 items-center px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 relative z-30">
                {/* Left Section - Logo */}
                <div className="flex items-center gap-4">
                    <PostloomLogo size="md" showText={true} className="[&_span]:dark:text-white" />
                </div>

                {/* Center Section - Import Tweet URL (Prominent) */}
                <div className="flex justify-center">
                    <div className="relative w-full max-w-2xl">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft-sm px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
                            <Input
                                type="url"
                                placeholder="Paste Twitter/X URL to import..."
                                value={importUrl}
                                onChange={(e) => {
                                    setImportUrl(e.target.value)
                                    setImportError(null)
                                }}
                                onKeyDown={handleImportKeyDown}
                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-sm placeholder:text-slate-400"
                                disabled={isImporting}
                            />
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleImport}
                                disabled={isImporting || !importUrl.trim()}
                                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shrink-0 transition-all active:scale-95"
                            >
                                {isImporting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    'Import'
                                )}
                            </Button>
                        </div>
                        {importError && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 flex items-start gap-1.5 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-2.5 py-1.5 z-50">
                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span>{importError}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3 justify-end">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft-sm">
                        <ThemeToggle />

                        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" onClick={undo}>
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" onClick={redo}>
                                    <Redo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo</TooltipContent>
                        </Tooltip>

                        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

                        <KeyboardShortcutsModal />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" onClick={reset}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset</TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Download Dropdown - Primary CTA */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-10 px-5 gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-95" disabled={isExporting}>
                                {isExporting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {isExporting ? 'Exporting...' : 'Export'}
                                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72 rounded-xl border-slate-100 dark:border-slate-800 shadow-soft-lg p-2">
                            {/* Export Progress */}
                            {isExporting && (
                                <div className="px-3 py-2">
                                    <p className="text-xs font-medium text-slate-500 mb-2">Exporting...</p>
                                    <Progress value={exportProgress} className="h-1.5" />
                                </div>
                            )}

                            {/* Size Presets */}
                            <div className="px-2 py-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Size</p>
                                <div className="space-y-0.5">
                                    {(Object.keys(EXPORT_SIZES) as ExportPreset[]).filter(k => k !== 'custom').map((preset) => (
                                        <DropdownMenuItem
                                            key={preset}
                                            className="text-sm cursor-pointer rounded-lg px-3 py-2 focus:bg-slate-50 dark:focus:bg-slate-800"
                                            onSelect={(e) => {
                                                e.preventDefault() // Prevent dropdown from closing
                                                setExportPreset(preset)
                                            }}
                                        >
                                            <span className="flex-1 font-medium">{EXPORT_SIZES[preset].label}</span>
                                            <span className="text-xs text-slate-400 tabular-nums">
                                                {EXPORT_SIZES[preset].width}×{EXPORT_SIZES[preset].height}
                                            </span>
                                            {exportSettings.preset === preset && (
                                                <span className="ml-2 text-blue-600">✓</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </div>

                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

                            {/* Export Buttons */}
                            <div className="p-1 space-y-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={handleExportPng}
                                    disabled={isExporting}
                                >
                                    <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Image className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="flex-1 text-left font-medium">Download PNG</span>
                                    <span className="text-xs text-slate-400">~{estimatedPngSize}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={handleExportGif}
                                    disabled={isExporting || !tweet.content.text || (tweet.content.text?.trim() ?? '').length === 0}
                                >
                                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Film className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="flex-1 text-left font-medium">Download GIF</span>
                                    <span className="text-xs text-slate-400">~{estimatedGifSize}</span>
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </TooltipProvider>
    )
}
