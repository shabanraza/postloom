import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEditorUi } from '../-state/editor-ui'

export const TOUR_STORAGE_KEY = 'postloom-onboarding-complete'

export interface TourStep {
    title: string
    body: string
    /** CSS selector of the real control to point at; centred card when missing or hidden */
    target?: string
}

export const TOUR_STEPS: TourStep[] = [
    {
        title: 'Make a post image in a minute',
        body: 'Here is a quick look at where everything is. It takes about 20 seconds.',
    },
    {
        title: 'Write your post',
        body: 'Content is where you type the post and set the name, photo and numbers. You can also paste a link to a real post.',
        target: '[aria-label="Content"]',
    },
    {
        title: 'What you see is what you download',
        body: 'The card updates as you type. Design and Background change the style around it.',
        target: '#tweet-canvas',
    },
    {
        title: 'X, Threads or LinkedIn',
        body: 'Pick the platform you are posting to and the card changes to match its look.',
        target: '[data-tour="platform"]',
    },
    {
        title: 'Keep your brand handy',
        body: 'Save your colours, fonts and logo once in the Brand Kit, then apply them in one click.',
        target: '[aria-label="Brand Kit"]',
    },
    {
        title: 'Download when it looks right',
        body: 'Export saves a PNG for any post, or a GIF where the text types itself out. No watermark.',
        target: '[data-tour="export"]',
    },
]

type Rect = { top: number; left: number; width: number; height: number }
const GAP = 16
const EDGE = 16

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max))

/** Where to put the tour card next to the highlighted control so it stays on screen. */
export function placeTourCard(
    rect: Rect | null,
    viewport: { width: number; height: number },
    card: { width: number; height: number }
): { top: number; left: number } {
    const maxLeft = viewport.width - card.width - EDGE
    const maxTop = viewport.height - card.height - EDGE
    if (!rect) {
        return {
            top: Math.round((viewport.height - card.height) / 2),
            left: Math.round((viewport.width - card.width) / 2),
        }
    }
    const right = rect.left + rect.width
    const bottom = rect.top + rect.height
    if (right + GAP + card.width <= viewport.width - EDGE) {
        return { top: clamp(rect.top, EDGE, maxTop), left: right + GAP }
    }
    if (bottom + GAP + card.height <= viewport.height - EDGE) {
        return { top: bottom + GAP, left: clamp(rect.left, EDGE, maxLeft) }
    }
    if (rect.top - GAP - card.height >= EDGE) {
        return { top: rect.top - GAP - card.height, left: clamp(rect.left, EDGE, maxLeft) }
    }
    // Big target (like the canvas): sit over its lower part, centred
    return {
        top: maxTop,
        left: clamp(Math.round(rect.left + rect.width / 2 - card.width / 2), EDGE, maxLeft),
    }
}

function findTarget(selector?: string): Rect | null {
    if (!selector || typeof document === 'undefined') return null
    const el = document.querySelector(selector)
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return null
    return { top: r.top, left: r.left, width: r.width, height: r.height }
}

/** Opens the tour on a first visit; the Help menu can open it again any time. */
export function useFirstVisitTour() {
    const setTourOpen = useEditorUi((s) => s.setTourOpen)
    useEffect(() => {
        let seen = true
        try {
            seen = localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
        } catch {
            // storage blocked: don't nag
        }
        if (seen) return
        const timer = setTimeout(() => setTourOpen(true), 600)
        return () => clearTimeout(timer)
    }, [setTourOpen])
}

export function GuidedTour() {
    const open = useEditorUi((s) => s.tourOpen)
    const setTourOpen = useEditorUi((s) => s.setTourOpen)
    const [index, setIndex] = useState(0)
    const [rect, setRect] = useState<Rect | null>(null)
    const [cardSize, setCardSize] = useState({ width: 320, height: 190 })
    const [viewport, setViewport] = useState({ width: 1024, height: 768 })
    const cardRef = useRef<HTMLDivElement>(null)

    const step = TOUR_STEPS[index]
    const isLast = index === TOUR_STEPS.length - 1

    const close = useCallback(() => {
        try {
            localStorage.setItem(TOUR_STORAGE_KEY, 'true')
        } catch {
            // ignore
        }
        setTourOpen(false)
        setIndex(0)
    }, [setTourOpen])

    // Measure the highlighted control and the card for this step
    useLayoutEffect(() => {
        if (!open) return
        const measure = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight })
            setRect(findTarget(step.target))
            if (cardRef.current) {
                setCardSize({ width: cardRef.current.offsetWidth || 320, height: cardRef.current.offsetHeight || 190 })
            }
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [open, step.target, index])

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
                close()
            }
        }
        document.addEventListener('keydown', onKey, true)
        return () => document.removeEventListener('keydown', onKey, true)
    }, [open, close])

    if (!open) return null

    const pos = placeTourCard(rect, viewport, cardSize)
    const pad = 6

    return (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Editor tour">
            {/* Dim everything except the control being explained */}
            {rect ? (
                <>
                    {/* Four panels around the hole (a huge box-shadow does not paint reliably) */}
                    {(() => {
                        const t = Math.max(0, rect.top - pad)
                        const l = Math.max(0, rect.left - pad)
                        const b = rect.top + rect.height + pad
                        const r = rect.left + rect.width + pad
                        const shade = 'fixed bg-black/55'
                        return (
                            <>
                                <div className={shade} style={{ top: 0, left: 0, right: 0, height: t }} />
                                <div className={shade} style={{ top: b, left: 0, right: 0, bottom: 0 }} />
                                <div className={shade} style={{ top: t, left: 0, width: l, height: b - t }} />
                                <div className={shade} style={{ top: t, left: r, right: 0, height: b - t }} />
                            </>
                        )
                    })()}
                    <div
                        className="pointer-events-none fixed rounded-xl ring-2 ring-white/90"
                        style={{
                            top: rect.top - pad,
                            left: rect.left - pad,
                            width: rect.width + pad * 2,
                            height: rect.height + pad * 2,
                        }}
                    />
                </>
            ) : (
                <div className="fixed inset-0 bg-black/55" />
            )}

            <div
                ref={cardRef}
                className="fixed w-[calc(100vw-2rem)] max-w-[320px] rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl"
                style={{ top: pos.top, left: pos.left }}
            >
                <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-xs font-medium text-muted-foreground">
                        {index + 1} of {TOUR_STEPS.length}
                    </p>
                    <button
                        type="button"
                        aria-label="Close tour"
                        onClick={close}
                        className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <h3 className="text-base font-semibold leading-snug">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1" aria-hidden="true">
                        {TOUR_STEPS.map((_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    i === index ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex gap-1.5">
                        {index === 0 ? (
                            <Button variant="ghost" size="sm" onClick={close}>
                                Skip
                            </Button>
                        ) : (
                            <Button variant="ghost" size="sm" onClick={() => setIndex(index - 1)}>
                                Back
                            </Button>
                        )}
                        <Button size="sm" onClick={() => (isLast ? close() : setIndex(index + 1))}>
                            {isLast ? 'Start creating' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
