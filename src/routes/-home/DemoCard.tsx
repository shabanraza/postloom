import { BadgeCheck, Heart, MessageCircle, Repeat2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A lightweight tweet card used on the landing page (live demo, bento, marquee).
 * Its colors are the card's own design, not app UI, so they are set per style here
 * rather than taken from the theme tokens.
 */
export type CardStyle = 'light' | 'dark' | 'sky' | 'sand'

export const CARD_STYLES: Record<
  CardStyle,
  { label: string; frame: string; card: string; text: string; muted: string; border: string }
> = {
  light: {
    label: 'Light',
    frame: '#e2e8f0',
    card: '#ffffff',
    text: '#0f1419',
    muted: '#536471',
    border: '#eff3f4',
  },
  dark: {
    label: 'Dark',
    frame: '#1e293b',
    card: '#000000',
    text: '#e7e9ea',
    muted: '#71767b',
    border: '#2f3336',
  },
  sky: {
    label: 'Sky',
    frame: '#0284c7',
    card: '#ffffff',
    text: '#0f1419',
    muted: '#536471',
    border: '#eff3f4',
  },
  sand: {
    label: 'Sand',
    frame: '#e9e1d4',
    card: '#fffdf9',
    text: '#1c1917',
    muted: '#78716c',
    border: '#ece6dc',
  },
}

export interface DemoCardProps {
  text: string
  name?: string
  handle?: string
  style?: CardStyle
  /** Padding around the card, in px */
  frame?: number
  className?: string
  /** Show a blinking caret after the text (typing animation) */
  caret?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export function DemoCard({
  text,
  name = 'Alex Rivera',
  handle = 'alexbuilds',
  style = 'sky',
  frame = 32,
  className,
  caret = false,
  ref,
}: DemoCardProps) {
  const s = CARD_STYLES[style]
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'P'

  return (
    <div ref={ref} className={cn('w-full', className)} style={{ background: s.frame, padding: frame }}>
      <div
        className="rounded-2xl p-5 shadow-xl"
        style={{ background: s.card, color: s.text, border: `1px solid ${s.border}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: '#0284c7' }}
          >
            {initials}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1 font-bold">
              <span className="truncate">{name || 'Your Name'}</span>
              <BadgeCheck className="size-4 shrink-0 fill-sky-500 text-white" />
            </div>
            <div className="truncate text-sm" style={{ color: s.muted }}>
              @{handle || 'yourhandle'}
            </div>
          </div>
        </div>
        <p className="mt-4 min-h-[3.5rem] text-[17px] leading-relaxed break-words whitespace-pre-wrap">
          {text}
          {caret && (
            <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-sky-500" />
          )}
        </p>
        <div
          className="mt-4 flex items-center gap-6 border-t pt-3 text-sm"
          style={{ color: s.muted, borderColor: s.border }}
        >
          <span className="flex items-center gap-1.5">
            <MessageCircle className="size-4" /> 128
          </span>
          <span className="flex items-center gap-1.5">
            <Repeat2 className="size-4" /> 342
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="size-4" /> 2.1K
          </span>
        </div>
      </div>
    </div>
  )
}
