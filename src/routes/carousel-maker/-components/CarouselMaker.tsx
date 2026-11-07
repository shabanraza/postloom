import { useMemo, useRef, useState } from 'react'
import { domToBlob, domToJpeg } from 'modern-screenshot'
import { FileText, Images, Loader2 } from 'lucide-react'
import {
  MAX_SLIDE_CHARS,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  buildPdfFromJpegs,
  buildZip,
  downloadBlob,
  fontSizeFor,
  splitIntoSlides,
} from '../-lib/carousel'
import { ToolPage, ToolWorkspace } from '@/components/layout/ToolPage'
import type { Faq } from '@/components/layout/ToolPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { trackExportComplete, trackExportError, trackExportStart } from '@/lib/analytics'

export type ThemeId = 'light' | 'dark' | 'sage'

export const THEMES: Record<ThemeId, { label: string; background: string; text: string; muted: string }> = {
  light: { label: 'Paper', background: '#faf9f6', text: '#1c1b18', muted: '#6f6b63' },
  dark: { label: 'Charcoal', background: '#1c1b18', text: '#ecebe6', muted: '#a09c92' },
  sage: {
    label: 'Sage',
    background: '#3f5c4a',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.75)',
  },
}

export const DEFAULT_SAMPLE = `1/ I grew a newsletter from 0 to 10,000 readers in 6 months. Here is exactly what worked.

2/ Write for one person. Every issue answers a single question your reader asked this week.

3/ Ship on the same day and time. Consistency beat clever topics every time.

4/ Turn every issue into 3 social posts. Carousels drove 40% of new sign-ups.

5/ Follow for more growth notes, and save this for later.`

const PREVIEW_SCALE = 0.25

export interface CarouselMakerProps {
  /** Hero heading (h1) and intro */
  title: string
  description: string
  steps: Array<string>
  faqs: Array<Faq>
  sample?: string
  defaultTheme?: ThemeId
  /** Which export gets the primary button */
  primary?: 'pdf' | 'png'
}

/** The carousel maker tool page, configurable so landing pages can reuse it. */
export function CarouselMaker({
  title,
  description,
  steps,
  faqs,
  sample = DEFAULT_SAMPLE,
  defaultTheme = 'dark',
  primary = 'pdf',
}: CarouselMakerProps) {
  const [text, setText] = useState(sample)
  const [name, setName] = useState('Your Name')
  const [handle, setHandle] = useState('yourhandle')
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme)
  const [accent, setAccent] = useState('#c9a96e')
  const [busy, setBusy] = useState<null | 'png' | 'pdf'>(null)
  const [error, setError] = useState<string | null>(null)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])

  const slides = useMemo(() => splitIntoSlides(text), [text])
  const theme = THEMES[themeId]

  const captureOptions = {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    scale: 1,
  }

  const slideElements = () =>
    slides.map((_, i) => slideRefs.current[i]).filter((el): el is HTMLDivElement => !!el)

  const runExport = async (format: 'png' | 'pdf') => {
    if (!slides.length || busy) return
    setBusy(format)
    setError(null)
    trackExportStart('carousel', format, { slides: slides.length, theme: themeId })
    try {
      const elements = slideElements()
      const base = (handle || 'postloom').replace(/[^a-z0-9_-]/gi, '') || 'postloom'
      if (format === 'png') {
        const files = []
        for (let i = 0; i < elements.length; i++) {
          const blob = await domToBlob(elements[i], { ...captureOptions, type: 'image/png' })
          files.push({ name: `${base}-carousel-${i + 1}.png`, data: new Uint8Array(await blob.arrayBuffer()) })
        }
        // One slide downloads as a PNG; several come as one ZIP so the browser
        // doesn't block or ask about multiple downloads
        if (files.length === 1) downloadBlob(new Blob([files[0].data], { type: 'image/png' }), files[0].name)
        else downloadBlob(buildZip(files), `${base}-carousel.zip`)
      } else {
        const pages = []
        for (const el of elements) {
          const dataUrl = await domToJpeg(el, { ...captureOptions, quality: 0.92 })
          const binary = atob(dataUrl.split(',')[1])
          const data = new Uint8Array(binary.length)
          for (let j = 0; j < binary.length; j++) data[j] = binary.charCodeAt(j)
          pages.push({ data, width: SLIDE_WIDTH, height: SLIDE_HEIGHT })
        }
        downloadBlob(buildPdfFromJpegs(pages), `${base}-carousel.pdf`)
      }
      trackExportComplete('carousel', format, { slides: slides.length, theme: themeId })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Export failed: ${message}`)
      trackExportError('carousel', format, message)
    } finally {
      setBusy(null)
    }
  }

  const controls = (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="carousel-text">Thread or text</Label>
          <Textarea
            id="carousel-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            A blank line starts a new slide. To keep blank lines inside a slide, put{' '}
            <code>---</code> between slides instead. Thread numbers like “1/” are removed. Over{' '}
            {MAX_SLIDE_CHARS} characters splits into extra slides.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="carousel-name">Name</Label>
            <Input id="carousel-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carousel-handle">Handle</Label>
            <Input
              id="carousel-handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label id="carousel-style-label">Style</Label>
          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup
              type="single"
              variant="outline"
              value={themeId}
              onValueChange={(value) => value && setThemeId(value as ThemeId)}
              aria-labelledby="carousel-style-label"
            >
              {(Object.keys(THEMES) as Array<ThemeId>).map((id) => (
                <ToggleGroupItem key={id} value={id} className="px-3">
                  {THEMES[id].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Label htmlFor="carousel-accent" className="gap-2 font-normal">
              Accent
              <input
                id="carousel-accent"
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
            </Label>
          </div>
        </div>

      </CardContent>
    </Card>
  )

  const preview = (
    <section aria-label="Slide preview">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {slides.length} {slides.length === 1 ? 'slide' : 'slides'} · 1080×1350
        </p>
        <div className="flex flex-wrap gap-2">
          {(primary === 'pdf' ? (['png', 'pdf'] as const) : (['pdf', 'png'] as const)).map((format) => (
            <Button
              key={format}
              variant={format === primary ? 'default' : 'outline'}
              onClick={() => runExport(format)}
              disabled={!slides.length || !!busy}
            >
              {busy === format ? <Loader2 className="animate-spin" /> : format === 'pdf' ? <FileText /> : <Images />}
              {format === 'pdf' ? 'PDF (LinkedIn)' : 'PNGs (Instagram)'}
            </Button>
          ))}
        </div>
      </div>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-4">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            style={{ width: SLIDE_WIDTH * PREVIEW_SCALE, height: SLIDE_HEIGHT * PREVIEW_SCALE }}
          >
            <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left' }}>
              <Slide
                ref={(el) => {
                  slideRefs.current[i] = el
                }}
                text={slide}
                index={i}
                total={slides.length}
                name={name}
                handle={handle}
                theme={theme}
                accent={accent}
              />
            </div>
          </div>
        ))}
        {!slides.length && (
          <p className="text-sm text-muted-foreground">Paste some text to see your slides.</p>
        )}
      </div>
    </section>
  )

  return (
    <ToolPage
      title={title}
      description={description}
      badges={['Free', 'No sign-up', 'No watermark']}
      steps={steps}
      faqs={faqs}
    >
      <ToolWorkspace controls={controls} preview={preview} />
    </ToolPage>
  )
}

export const CAROUSEL_FAQS: Array<Faq> = [
  {
    question: 'What size are the slides?',
    answer:
      '1080×1350 pixels (4:5), the portrait size Instagram and LinkedIn both show largest in the feed.',
  },
  {
    question: 'Is it free?',
    answer: 'Yes. No sign-up and no account needed; everything runs in your browser.',
  },
  {
    question: 'How do I post a carousel on LinkedIn?',
    answer: 'Create a post, choose “Add a document”, upload the PDF and give it a title.',
  },
]

interface SlideProps {
  text: string
  index: number
  total: number
  name: string
  handle: string
  theme: (typeof THEMES)[ThemeId]
  accent: string
  ref?: React.Ref<HTMLDivElement>
}

export function Slide({ text, index, total, name, handle, theme, accent, ref }: SlideProps) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'P'
  const isLast = index === total - 1

  return (
    <div
      ref={ref}
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        background: theme.background,
        color: theme.text,
        padding: 96,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: '50%',
            background: accent,
            color: '#1c1b18',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{name}</div>
          {handle && <div style={{ fontSize: 34, color: theme.muted }}>@{handle}</div>}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          fontSize: fontSizeFor(text),
          lineHeight: 1.3,
          fontWeight: 600,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 30,
          color: theme.muted,
        }}
      >
        <span>
          <span style={{ color: accent, fontWeight: 700 }}>{index + 1}</span> / {total}
        </span>
        {/* No credit on the last slide: downloads have no watermark */}
        {!isLast && <span>Swipe →</span>}
      </div>
    </div>
  )
}
