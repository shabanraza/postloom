import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Download, Loader2 } from 'lucide-react'
import { CARD_STYLES, DemoCard } from './DemoCard'
import type { CardStyle } from './DemoCard'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { trackCtaClick, trackEvent, trackExportComplete, trackExportError, trackExportStart } from '@/lib/analytics'

const SAMPLES = [
  'Shipped my side project today. 3 months of nights and weekends, 1 tiny tool, 0 regrets.',
  'The best marketing is a product people want to screenshot.',
  'Write the tweet. Make it beautiful. Post it everywhere.',
]

const MAX_CHARS = 280

/** Hero demo: types sample tweets until the visitor edits, then renders their text live. */
export function LiveDemo({ source = 'home' }: { source?: string } = {}) {
  const reduce = useReducedMotion()
  const [text, setText] = useState(SAMPLES[0])
  const [typing, setTyping] = useState(false)
  const [touched, setTouched] = useState(false)
  const [style, setStyle] = useState<CardStyle>('sage')
  const [busy, setBusy] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Typing animation, client-only, stops as soon as the visitor interacts.
  useEffect(() => {
    if (reduce || touched) return
    let sample = 0
    let i = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>
    setTyping(true)
    const step = () => {
      const full = SAMPLES[sample]
      if (!deleting) {
        i++
        setText(full.slice(0, i))
        if (i === full.length) {
          deleting = true
          timer = setTimeout(step, 2200)
          return
        }
        timer = setTimeout(step, 38)
      } else {
        i = Math.max(0, i - 3)
        setText(full.slice(0, i))
        if (i === 0) {
          deleting = false
          sample = (sample + 1) % SAMPLES.length
        }
        timer = setTimeout(step, 18)
      }
    }
    timer = setTimeout(step, 600)
    return () => {
      clearTimeout(timer)
      setTyping(false)
    }
  }, [reduce, touched])

  const takeOver = () => {
    if (touched) return
    setTouched(true)
    setText(SAMPLES[0])
    trackEvent('home_demo_interact')
  }

  const download = async () => {
    if (!cardRef.current || busy) return
    setBusy(true)
    takeOver()
    trackExportStart('tweet_demo', 'png', { theme: style, location: source })
    try {
      const { domToBlob } = await import('modern-screenshot')
      const blob = await domToBlob(cardRef.current, { scale: 2, type: 'image/png' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'postloom-tweet-card.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      trackExportComplete('tweet_demo', 'png', { theme: style, location: source })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      trackExportError('tweet_demo', 'png', message, { location: source })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-lg sm:p-4">
      <div className="overflow-hidden rounded-xl">
        <DemoCard ref={cardRef} text={text} style={style} caret={typing && !touched} />
      </div>

      <div className="mt-4 space-y-3 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-text">Try it: write your tweet</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <Textarea
            id="demo-text"
            value={text}
            maxLength={MAX_CHARS}
            rows={2}
            onFocus={takeOver}
            onChange={(e) => {
              setTouched(true)
              setText(e.target.value)
            }}
            className="resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={style}
            onValueChange={(v) => {
              if (!v) return
              setStyle(v as CardStyle)
              trackEvent('home_demo_style', { theme: v })
            }}
            aria-label="Card style"
          >
            {(Object.keys(CARD_STYLES) as Array<CardStyle>).map((id) => (
              <ToggleGroupItem key={id} value={id} className="px-2.5 text-xs">
                {CARD_STYLES[id].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" asChild>
              <Link
                to="/tweet-card-generator"
                onClick={() => trackCtaClick('demo_open_editor', `${source}_demo`)}
              >
                Full editor
                <ArrowRight />
              </Link>
            </Button>
            <Button size="sm" onClick={download} disabled={busy || !text.trim()}>
              {busy ? <Loader2 className="animate-spin" /> : <Download />}
              Download PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
