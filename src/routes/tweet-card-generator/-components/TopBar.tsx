import { useState } from 'react'
import { Undo2, Redo2, RotateCcw, ChevronDown, Download, Image, Film, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useTweetStudioStore } from '../-state'
import { EXPORT_SIZES } from '../-constants'
import { exportAsPng, exportAsGif, copyToClipboard, estimateFileSize } from '../-export'
import { trackExport, trackExportStart, trackExportError, trackExportSizeChange } from '@/lib/analytics'
import { PostloomLogo } from '@/components/PostloomLogo'
import type { ExportPreset } from '../-types'

export function TopBar() {
    const [copied, setCopied] = useState(false)
    
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
    } = useTweetStudioStore()

    const handleExportPng = async () => {
        const canvasElement = document.getElementById('tweet-canvas')
        if (!canvasElement) {
            console.error('Canvas element not found')
            return
        }

        setIsExporting(true)
        setExportProgress(0)
        
        trackExportStart('png', exportSettings.width, exportSettings.height)

        try {
            await exportAsPng(canvasElement, tweet.profile.username, {
                width: exportSettings.width,
                height: exportSettings.height,
            })
            trackExport('png', exportSettings.width, exportSettings.height)
        } catch (error) {
            console.error('Export failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            trackExportError('png', errorMessage)
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

        if (!tweet.content.text || tweet.content.text.trim().length === 0) {
            alert('Please enter some text before exporting as GIF')
            return
        }

        setIsExporting(true)
        setExportProgress(0)
        
        trackExportStart('gif', exportSettings.width, exportSettings.height)

        try {
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
            trackExportError('gif', errorMessage)
            alert(`GIF export failed: ${errorMessage}\n\nIf this persists, try:\n- Reducing the text length\n- Using a smaller export size\n- Refreshing the page`)
        } finally {
            setIsExporting(false)
            setExportProgress(0)
        }
    }

    const handleCopyToClipboard = async () => {
        const canvasElement = document.getElementById('tweet-canvas')
        if (!canvasElement) {
            console.error('Canvas element not found')
            return
        }

        setIsExporting(true)
        
        try {
            await copyToClipboard(canvasElement, {
                width: exportSettings.width,
                height: exportSettings.height,
            })
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Copy failed:', error)
            alert('Failed to copy to clipboard. Your browser may not support this feature.')
        } finally {
            setIsExporting(false)
        }
    }

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
            <header className="flex h-12 sm:h-14 shrink-0 items-center justify-between px-2 sm:px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 relative z-30">
                {/* Left Section - Logo */}
                <div className="flex items-center">
                    <PostloomLogo size="sm" showText={false} className="sm:hidden" />
                    <PostloomLogo size="md" showText={true} className="hidden sm:flex [&_span]:dark:text-white" />
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-1 sm:gap-3">
                    {/* Desktop action bar */}
                    <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft-sm">
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

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" onClick={reset}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset</TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Mobile: Theme toggle only */}
                    <div className="sm:hidden">
                        <ThemeToggle />
                    </div>

                    {/* Download Dropdown - Primary CTA */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                className="h-9 sm:h-10 px-3 sm:px-5 gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-95 text-sm sm:text-base" 
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                                <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-60" />
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
                                                e.preventDefault()
                                                setExportPreset(preset)
                                                trackExportSizeChange(preset, EXPORT_SIZES[preset].width, EXPORT_SIZES[preset].height)
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

                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={handleCopyToClipboard}
                                    disabled={isExporting}
                                >
                                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </div>
                                    <span className="flex-1 text-left font-medium">
                                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                                    </span>
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </TooltipProvider>
    )
}
