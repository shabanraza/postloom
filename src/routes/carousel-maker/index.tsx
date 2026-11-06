import { useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { domToBlob, domToJpeg } from 'modern-screenshot'
import { FileText, Images, Loader2 } from 'lucide-react'
import {
  MAX_SLIDE_CHARS,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  buildPdfFromJpegs,
  downloadBlob,
  fontSizeFor,
  splitIntoSlides,
} from './-lib/carousel'
import { ToolPage, ToolWorkspace } from '@/components/layout/ToolPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { trackEvent } from '@/lib/analytics'

const pageUrl = 'https://postloom.studio/carousel-maker'
const pageTitle = 'Free Carousel Maker for Instagram & LinkedIn – Thread to Carousel | Postloom'
const pageDescription =
  'Turn a tweet thread or any text into an Instagram carousel or LinkedIn PDF carousel in seconds. Paste your text, pick a style, download PNG slides or a PDF. Free, no sign-up.'

export const Route = createFileRoute('/carousel-maker/')({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: 'description', content: pageDescription },
      { property: 'og:url', content: pageUrl },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { name: 'twitter:url', content: pageUrl },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
    ],
    links: [{ rel: 'canonical', href: pageUrl }],
  }),
  component: CarouselMakerPage,
})

type ThemeId = 'light' | 'dark' | 'blue'

const THEMES: Record<ThemeId, { label: string; background: string; text: string; muted: string }> = {
  light: { label: 'Light', background: '#ffffff', text: '#0f172a', muted: '#64748b' },
  dark: { label: 'Dark', background: '#0b0f19', text: '#f8fafc', muted: '#94a3b8' },
  blue: {
    label: 'Blue',
    background: '#0c4a6e',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.75)',
  },
}

const SAMPLE = `1/ I grew a newsletter from 0 to 10,000 readers in 6 months. Here is exactly what worked.

2/ Write for one person. Every issue answers a single question your reader asked this week.

3/ Ship on the same day and time. Consistency beat clever topics every time.

4/ Turn every issue into 3 social posts. Carousels drove 40% of new sign-ups.

5/ Follow for more growth notes, and save this for later.`

const PREVIEW_SCALE = 0.25

function CarouselMakerPage() {
  const [text, setText] = useState(SAMPLE)
  const [name, setName] = useState('Your Name')
  const [handle, setHandle] = useState('yourhandle')
  const [themeId, setThemeId] = useState<ThemeId>('dark')
  const [accent, setAccent] = useState('#38bdf8')
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
    trackEvent('export_start', { format: `carousel_${format}`, slides: slides.length, theme: themeId })
    try {
      const elements = slideElements()
      const base = (handle || 'postloom').replace(/[^a-z0-9_-]/gi, '') || 'postloom'
      if (format === 'png') {
        for (let i = 0; i < elements.length; i++) {
          const blob = await domToBlob(elements[i], { ...captureOptions, type: 'image/png' })
          downloadBlob(blob, `${base}-carousel-${i + 1}.png`)
        }
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
      trackEvent('export_complete', {
        format: `carousel_${format}`,
        slides: slides.length,
        theme: themeId,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Export failed: ${message}`)
      trackEvent('export_error', { format: `carousel_${format}`, error_message: message.slice(0, 100) })
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
            A blank line or <code>---</code> starts a new slide. Thread numbers like “1/” are
            removed. Over {MAX_SLIDE_CHARS} characters splits into extra slides.
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

        <Separator />

        <div className="flex flex-col gap-2">
          <Button onClick={() => runExport('pdf')} disabled={!slides.length || !!busy}>
            {busy === 'pdf' ? <Loader2 className="animate-spin" /> : <FileText />}
            Download PDF (LinkedIn)
          </Button>
          <Button
            variant="outline"
            onClick={() => runExport('png')}
            disabled={!slides.length || !!busy}
          >
            {busy === 'png' ? <Loader2 className="animate-spin" /> : <Images />}
            Download PNGs (Instagram)
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  )

  const preview = (
    <section aria-label="Slide preview">
      <p className="mb-3 text-sm text-muted-foreground">
        {slides.length} {slides.length === 1 ? 'slide' : 'slides'} · 1080×1350
      </p>
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
      title="Free carousel maker for Instagram and LinkedIn"
      description="Paste a tweet thread or any text. Each paragraph becomes a 1080×1350 slide. Download PNG slides for Instagram or one PDF for a LinkedIn carousel post."
      badges={['Free', 'No sign-up', 'No watermark']}
      steps={[
        'Paste a tweet thread, newsletter section or list of tips.',
        'Add your name and handle, then pick a light, dark or blue style and an accent color.',
        'Download one PDF to upload as a LinkedIn document post, or PNG slides for an Instagram carousel.',
      ]}
      faqs={FAQS}
    >
      <ToolWorkspace controls={controls} preview={preview} />
    </ToolPage>
  )
}

const FAQS = [
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

function Slide({ text, index, total, name, handle, theme, accent, ref }: SlideProps) {
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
            color: '#0b0f19',
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
        <span>{isLast ? 'Made with postloom.studio' : 'Swipe →'}</span>
      </div>
    </div>
  )
}
