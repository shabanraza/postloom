import { useState } from 'react'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'
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
import { EXPORT_FORMAT_COPY, EXPORT_SIZES } from '../-constants'
import { exportAsPng, exportAsGif, copyToClipboard, type ExportResult } from '../-export'
import { formatBytes } from '../-utils'
import { HelpMenu } from './HelpMenu'
import { sizeParams, trackExportComplete, trackExportStart, trackExportError, trackExportSizeChange } from '@/lib/analytics'
import { PostloomLogo } from '@/components/PostloomLogo'
import type { ExportPreset } from '../-types'

function confirmSaved(result: ExportResult) {
    toast.success(`Saved ${result.filename}`, {
        description: `${result.width}×${result.height} · ${formatBytes(result.bytes)} · in your Downloads folder`,
    })
}

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
        history,
        historyIndex,
    } = useTweetStudioStore()

    const canUndo = historyIndex > 0
    const canRedo = historyIndex < history.length - 1
    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
    const mod = isMac ? '⌘' : 'Ctrl+'

    const handleReset = () => {
        reset()
        toast('Card reset to the starting design', {
            duration: 10000,
            action: { label: 'Undo', onClick: () => useTweetStudioStore.getState().undo() },
        })
    }

    const handleExportPng = async () => {
        const canvasElement = document.getElementById('tweet-canvas')
        if (!canvasElement) {
            console.error('Canvas element not found')
            return
        }

        setIsExporting(true)
        setExportProgress(0)
        
        trackExportStart('tweet_card', 'png', sizeParams(exportSettings.width, exportSettings.height))

        try {
            const result = await exportAsPng(canvasElement, tweet.profile.username, {
                width: exportSettings.width,
                height: exportSettings.height,
            })
            confirmSaved(result)
            trackExportComplete('tweet_card', 'png', sizeParams(exportSettings.width, exportSettings.height))
        } catch (error) {
            console.error('Export failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            trackExportError('tweet_card', 'png', errorMessage)
            toast.error('Could not save the PNG', { description: 'Try again, or pick a smaller size.' })
        } finally {
            setIsExporting(false)
            setExportProgress(0)
        }
    }

    const handleExportGif = async () => {
        const canvasElement = document.getElementById('tweet-canvas')
        if (!canvasElement) {
            console.error('Canvas element not found')
            toast.error('Could not find the card. Please refresh the page.')
            return
        }

        if (!tweet.content.text || tweet.content.text.trim().length === 0) {
            toast.error('Add some post text first, so there is something to animate.')
            return
        }

        setIsExporting(true)
        setExportProgress(0)
        
        trackExportStart('tweet_card', 'gif', sizeParams(exportSettings.width, exportSettings.height))

        try {
            const result = await exportAsGif(canvasElement, tweet.profile.username, {
                width: exportSettings.width,
                height: exportSettings.height,
                text: tweet.content.text,
                speed: animation.speed,
                fps: animation.fps,
                loop: animation.loop,
                onProgress: (progress) => setExportProgress(progress * 100),
            })
            confirmSaved(result)
            trackExportComplete('tweet_card', 'gif', sizeParams(exportSettings.width, exportSettings.height))
        } catch (error) {
            console.error('GIF export failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            trackExportError('tweet_card', 'gif', errorMessage)
            toast.error('Could not make the GIF', {
                description: 'Try shorter text or a smaller size, then try again.',
            })
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
            toast.success('Copied. Paste it into your post.')
            trackExportComplete('tweet_card', 'clipboard', sizeParams(exportSettings.width, exportSettings.height))
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Copy failed:', error)
            trackExportError('tweet_card', 'clipboard', error)
            toast.error('Your browser blocked copying', { description: 'Use Download PNG instead.' })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <TooltipProvider delayDuration={300}>
            <header className="flex h-12 sm:h-14 shrink-0 items-center justify-between px-2 sm:px-4 bg-card/80 backdrop-blur-md border-b border-border/60 relative z-30">
                {/* Left Section - Logo */}
                <Link
                    to="/"
                    aria-label="Postloom home"
                    className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <PostloomLogo size="sm" showText={false} className="sm:hidden" />
                    <PostloomLogo size="md" showText={true} className="hidden sm:flex" />
                </Link>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-1 sm:gap-3">
                    {/* Desktop action bar */}
                    <div className="hidden sm:flex items-center gap-1 bg-card p-1 rounded-xl border border-border shadow-soft-sm">
                        <ThemeToggle />
                        <HelpMenu />

                        <div className="w-px h-5 bg-muted mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent rounded-lg text-muted-foreground" onClick={undo} disabled={!canUndo} aria-label="Undo">
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo <kbd className="ml-1 font-mono text-[10px] opacity-70">{mod}Z</kbd></TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent rounded-lg text-muted-foreground" onClick={redo} disabled={!canRedo} aria-label="Redo">
                                    <Redo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo <kbd className="ml-1 font-mono text-[10px] opacity-70">{mod}{isMac ? '⇧Z' : 'Y'}</kbd></TooltipContent>
                        </Tooltip>

                        <div className="w-px h-5 bg-muted mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent rounded-lg text-muted-foreground" onClick={handleReset} aria-label="Reset card">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Start over</TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Mobile: Theme toggle only */}
                    <div className="sm:hidden flex items-center">
                        <HelpMenu />
                        <ThemeToggle />
                    </div>

                    {/* Download Dropdown - Primary CTA */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                data-tour="export"
                                className="h-9 sm:h-10 px-3 sm:px-5 gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all active:scale-95 text-sm sm:text-base" 
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
                        <DropdownMenuContent align="end" className="w-72 rounded-xl border-border shadow-soft-lg p-2">
                            {/* Export Progress */}
                            {isExporting && (
                                <div className="px-3 py-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Exporting...</p>
                                    <Progress value={exportProgress} className="h-1.5" />
                                </div>
                            )}

                            {/* Size Presets */}
                            <div className="px-2 py-1.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Size</p>
                                <div className="space-y-0.5">
                                    {(Object.keys(EXPORT_SIZES) as ExportPreset[]).filter(k => k !== 'custom').map((preset) => (
                                        <DropdownMenuItem
                                            key={preset}
                                            className="text-sm cursor-pointer rounded-lg px-3 py-2 focus:bg-muted/50"
                                            onSelect={(e) => {
                                                e.preventDefault()
                                                setExportPreset(preset)
                                                trackExportSizeChange(preset, EXPORT_SIZES[preset].width, EXPORT_SIZES[preset].height)
                                            }}
                                        >
                                            <span className="flex-1 font-medium">{EXPORT_SIZES[preset].label}</span>
                                            <span className="text-xs text-muted-foreground tabular-nums">
                                                {EXPORT_SIZES[preset].width}×{EXPORT_SIZES[preset].height}
                                            </span>
                                            {exportSettings.preset === preset && (
                                                <span className="ml-2 text-brand">✓</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </div>

                            <DropdownMenuSeparator className="bg-muted my-1" />

                            {/* Export Buttons */}
                            <div className="p-1 space-y-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-12 rounded-lg hover:bg-accent"
                                    onClick={handleExportPng}
                                    disabled={isExporting}
                                >
                                    <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Image className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="flex flex-1 flex-col items-start text-left leading-tight"><span className="font-medium">{EXPORT_FORMAT_COPY.png.title}</span><span className="text-xs font-normal text-muted-foreground">{EXPORT_FORMAT_COPY.png.hint}</span></span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-12 rounded-lg hover:bg-accent"
                                    onClick={handleExportGif}
                                    disabled={isExporting || !tweet.content.text || (tweet.content.text?.trim() ?? '').length === 0}
                                >
                                    <div className="w-6 h-6 rounded bg-brand/10 flex items-center justify-center text-brand">
                                        <Film className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="flex flex-1 flex-col items-start text-left leading-tight"><span className="font-medium">{EXPORT_FORMAT_COPY.gif.title}</span><span className="text-xs font-normal text-muted-foreground">{EXPORT_FORMAT_COPY.gif.hint}</span></span>
                                </Button>

                                <DropdownMenuSeparator className="bg-muted my-1" />

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-10 rounded-lg hover:bg-accent"
                                    onClick={handleCopyToClipboard}
                                    disabled={isExporting}
                                >
                                    <div className="w-6 h-6 rounded bg-brand/10 flex items-center justify-center text-brand">
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
