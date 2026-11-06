import { useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { domToBlob } from 'modern-screenshot'
import { Check, Copy, Download, Import, Loader2, Plus, Star, Trash2 } from 'lucide-react'
import { downloadBlob } from '../carousel-maker/-lib/carousel'
import { fetchTweetFromUrl } from '../tweet-card-generator/-utils/fetch-tweet'
import {
  CARD_SIZES,
  buildWallEmbed,
  cleanTweetText,
  initialsOf,
  parseTweetUrls,
  quoteFontSize,
} from './-lib/testimonial'
import type { CardSize, Testimonial, WallTheme } from './-lib/testimonial'
import { ToolPage, ToolWorkspace } from '@/components/layout/ToolPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { trackEvent } from '@/lib/analytics'

const pageUrl = 'https://postloom.studio/testimonial-generator'
const pageTitle = 'Free Testimonial Image Generator – Tweet to Testimonial & Wall of Love | Postloom'
const pageDescription =
  'Turn tweets and customer quotes into branded testimonial images and a free wall of love embed for your website. Paste tweet links, pick a style, download PNGs. No sign-up, no watermark.'

export const Route = createFileRoute('/testimonial-generator/')({
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
  component: TestimonialGeneratorPage,
})

type StyleId = 'paper' | 'charcoal' | 'sage'

/** Card designs are exported content, so they carry their own colors. */
const STYLES: Record<StyleId, WallTheme & { label: string }> = {
  paper: {
    label: 'Paper',
    background: '#efece5',
    card: '#ffffff',
    text: '#1c1b18',
    muted: '#6f6b63',
    border: '#e5e1d8',
  },
  charcoal: {
    label: 'Charcoal',
    background: '#1c1b18',
    card: '#26251f',
    text: '#ecebe6',
    muted: '#a09c92',
    border: '#34332d',
  },
  sage: {
    label: 'Sage',
    background: '#3f5c4a',
    card: '#fbfcfa',
    text: '#1c1b18',
    muted: '#66705f',
    border: '#e4ebe3',
  },
}

let nextId = 0
const newId = () => `t${Date.now().toString(36)}${(nextId++).toString(36)}`

const SAMPLES: Array<Testimonial> = [
  {
    id: 's1',
    text: 'Switched our onboarding emails to this and activation went up 18% in two weeks. Wish we had done it sooner.',
    name: 'Maya Chen',
    handle: 'mayabuilds',
  },
  {
    id: 's2',
    text: 'The only tool our whole team actually opens every day.',
    name: 'Dev Patel',
    handle: 'Head of Growth, Northwind',
  },
  {
    id: 's3',
    text: 'Set up in ten minutes, paid for itself in the first week. Support answered in under an hour.',
    name: 'Lena Kim',
    handle: 'lenacodes',
  },
]

const PREVIEW_WIDTH = 300

function TestimonialGeneratorPage() {
  const [items, setItems] = useState<Array<Testimonial>>(SAMPLES)
  const [urls, setUrls] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [styleId, setStyleId] = useState<StyleId>('paper')
  const [sizeId, setSizeId] = useState<CardSize['id']>('square')
  const [accent, setAccent] = useState('#4a6b57')
  const [brand, setBrand] = useState('Acme')
  const [stars, setStars] = useState(true)
  const [wallTitle, setWallTitle] = useState('Loved by makers')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const style = STYLES[styleId]
  const size = CARD_SIZES.find((s) => s.id === sizeId)!
  const scale = PREVIEW_WIDTH / size.width
  const embed = useMemo(
    () => buildWallEmbed(items, { theme: style, accent, title: wallTitle.trim() || undefined }),
    [items, style, accent, wallTitle],
  )

  const update = (id: string, patch: Partial<Testimonial>) =>
    setItems((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const remove = (id: string) => setItems((list) => list.filter((t) => t.id !== id))
  const addBlank = () =>
    setItems((list) => [...list, { id: newId(), text: 'What your customer said.', name: 'Customer Name', handle: 'handle' }])

  const runImport = async () => {
    const found = parseTweetUrls(urls)
    if (!found.length) {
      setImportError('Paste one or more links like https://x.com/user/status/123.')
      return
    }
    setImporting(true)
    setImportError(null)
    const imported: Array<Testimonial> = []
    const failed: Array<string> = []
    for (const url of found) {
      try {
        const tweet = await fetchTweetFromUrl(url)
        imported.push({
          id: newId(),
          text: cleanTweetText(tweet.text),
          name: tweet.user.name,
          handle: tweet.user.screen_name,
          avatarUrl: tweet.user.profile_image_url_https || undefined,
          sourceUrl: url,
        })
      } catch {
        failed.push(url)
      }
    }
    // Imported tweets replace the sample quotes the first time
    setItems((list) => [...list.filter((t) => !t.id.startsWith('s')), ...imported])
    setUrls(failed.join('\n'))
    if (failed.length) setImportError(`Couldn't import ${failed.length} link(s). The post may be private or deleted.`)
    trackEvent('testimonial_import', { requested: found.length, imported: imported.length })
    setImporting(false)
  }

  const exportPngs = async () => {
    if (!items.length || busy) return
    setBusy(true)
    setError(null)
    trackEvent('export_start', { format: 'testimonial_png', cards: items.length, style: styleId, size: sizeId })
    try {
      for (let i = 0; i < items.length; i++) {
        const el = cardRefs.current[items[i].id]
        if (!el) continue
        const blob = await domToBlob(el, { width: size.width, height: size.height, scale: 1, type: 'image/png' })
        const who = (items[i].handle || items[i].name).replace(/[^a-z0-9_-]/gi, '').slice(0, 30) || 'customer'
        downloadBlob(blob, `testimonial-${i + 1}-${who}.png`)
      }
      trackEvent('export_complete', { format: 'testimonial_png', cards: items.length, style: styleId, size: sizeId })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Export failed: ${message}`)
      trackEvent('export_error', { format: 'testimonial_png', error_message: message.slice(0, 100) })
    } finally {
      setBusy(false)
    }
  }

  const copyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embed)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackEvent('export_complete', { format: 'testimonial_embed', cards: items.length, style: styleId })
    } catch {
      setError('Copy failed. Select the code below and copy it manually.')
    }
  }

  const controls = (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tweet-urls">Import from X</Label>
          <Textarea
            id="tweet-urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={3}
            placeholder={'https://x.com/user/status/123\nhttps://x.com/user/status/456'}
            className="font-mono text-sm"
          />
          <Button variant="outline" className="w-full" onClick={runImport} disabled={importing || !urls.trim()}>
            {importing ? <Loader2 className="animate-spin" /> : <Import />}
            Import tweets
          </Button>
          {importError && <p className="text-sm text-destructive">{importError}</p>}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Testimonials ({items.length})</Label>
            <Button variant="ghost" size="sm" onClick={addBlank}>
              <Plus /> Add
            </Button>
          </div>
          {items.map((t, i) => (
            <div key={t.id} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => remove(t.id)}
                  aria-label={`Remove testimonial ${i + 1}`}
                >
                  <Trash2 />
                </Button>
              </div>
              <Textarea
                value={t.text}
                onChange={(e) => update(t.id, { text: e.target.value })}
                rows={3}
                aria-label={`Quote ${i + 1}`}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} aria-label={`Name ${i + 1}`} />
                <Input
                  value={t.handle}
                  onChange={(e) => update(t.id, { handle: e.target.value.replace(/^@/, '') })}
                  placeholder="handle or role"
                  aria-label={`Handle or role ${i + 1}`}
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label id="style-label">Style</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={styleId}
              onValueChange={(v) => v && setStyleId(v as StyleId)}
              aria-labelledby="style-label"
            >
              {(Object.keys(STYLES) as Array<StyleId>).map((id) => (
                <ToggleGroupItem key={id} value={id} className="px-3">
                  {STYLES[id].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label id="size-label">Size</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={sizeId}
              onValueChange={(v) => v && setSizeId(v as CardSize['id'])}
              aria-labelledby="size-label"
            >
              {CARD_SIZES.map((s) => (
                <ToggleGroupItem key={s.id} value={s.id} className="px-3">
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand name</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Your product" />
            </div>
            <Label htmlFor="accent" className="h-9 gap-2 font-normal">
              Accent
              <input
                id="accent"
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
            </Label>
          </div>
          <Label htmlFor="stars" className="justify-between font-normal">
            Show 5-star rating
            <Switch id="stars" checked={stars} onCheckedChange={setStars} />
          </Label>
        </div>
      </CardContent>
    </Card>
  )

  const preview = (
    <Tabs defaultValue="images">
      <TabsList>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="wall">Wall of love</TabsTrigger>
      </TabsList>

      <TabsContent value="images" className="mt-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? 'card' : 'cards'} · {size.width}×{size.height}
          </p>
          <Button onClick={exportPngs} disabled={!items.length || busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Download />}
            Download PNGs
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap gap-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="overflow-hidden rounded-lg border border-border shadow-sm"
              style={{ width: PREVIEW_WIDTH, height: size.height * scale }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <TestimonialCard
                  ref={(el) => {
                    cardRefs.current[t.id] = el
                  }}
                  item={t}
                  size={size}
                  theme={style}
                  accent={accent}
                  brand={brand}
                  stars={stars}
                />
              </div>
            </div>
          ))}
          {!items.length && (
            <p className="text-sm text-muted-foreground">Import a tweet or add a testimonial to get started.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="wall" className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="wall-title">Heading</Label>
            <Input id="wall-title" value={wallTitle} onChange={(e) => setWallTitle(e.target.value)} />
          </div>
          <Button onClick={copyEmbed} disabled={!items.length}>
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied' : 'Copy embed code'}
          </Button>
        </div>
        <iframe
          title="Wall of love preview"
          srcDoc={`<!doctype html><meta charset="utf-8"><body style="margin:0">${embed}</body>`}
          sandbox=""
          className="h-[480px] w-full rounded-lg border border-border bg-card"
        />
        <Textarea
          readOnly
          value={embed}
          rows={6}
          aria-label="Embed code"
          className="font-mono text-xs"
          onFocus={(e) => e.currentTarget.select()}
        />
        <p className="text-xs text-muted-foreground">
          Plain HTML with inline styles and no scripts. Paste it into an HTML or embed block in Webflow, Framer,
          WordPress, Notion sites or your own code.
        </p>
      </TabsContent>
    </Tabs>
  )

  return (
    <ToolPage
      title="Free testimonial image generator"
      description="Turn tweets and customer quotes into branded testimonial images, plus a wall of love you can embed on your website. Paste tweet links or type quotes, pick a style, download."
      badges={['Free', 'No sign-up', 'No watermark']}
      steps={[
        'Paste links to tweets about your product, or type quotes from emails, reviews and calls.',
        'Pick a paper, charcoal or sage style, a size and your brand name and accent color.',
        'Download PNGs for social posts and sales decks, or copy the wall of love code for your website.',
      ]}
      faqs={FAQS}
    >
      <ToolWorkspace controls={controls} preview={preview} />
    </ToolPage>
  )
}

const FAQS = [
  {
    question: 'Is the testimonial generator free?',
    answer: 'Yes. No sign-up, no watermark and no limit on downloads. Everything runs in your browser.',
  },
  {
    question: 'Can I import tweets as testimonials?',
    answer:
      'Paste links to public posts on X (Twitter). Postloom pulls in the text, name and handle; you can edit the quote before exporting.',
  },
  {
    question: 'What is a wall of love?',
    answer:
      'A section on your website that shows what customers say about you. Postloom gives you plain HTML you can paste into any site builder, with no script or account to maintain.',
  },
  {
    question: 'Which sizes can I download?',
    answer:
      'Square 1080×1080 for Instagram and LinkedIn, portrait 1080×1350 for the feed, and landscape 1200×675 for X, slides and landing pages.',
  },
]

interface TestimonialCardProps {
  item: Testimonial
  size: CardSize
  theme: WallTheme
  accent: string
  brand: string
  stars: boolean
  ref?: React.Ref<HTMLDivElement>
}

function TestimonialCard({ item, size, theme, accent, brand, stars, ref }: TestimonialCardProps) {
  const landscape = size.id === 'landscape'
  const pad = landscape ? 64 : 80
  const handle = item.handle ? (item.handle.includes(' ') ? item.handle : `@${item.handle}`) : ''
  const [avatarFailed, setAvatarFailed] = useState(false)
  const showAvatar = item.avatarUrl && !avatarFailed

  return (
    <div
      ref={ref}
      style={{
        width: size.width,
        height: size.height,
        background: theme.background,
        padding: pad,
        boxSizing: 'border-box',
        display: 'flex',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          flex: 1,
          background: theme.card,
          color: theme.text,
          border: `2px solid ${theme.border}`,
          borderRadius: 40,
          padding: landscape ? 56 : 72,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px -24px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: landscape ? 120 : 150, lineHeight: 0.8, color: accent, fontFamily: 'Georgia, serif', height: landscape ? 60 : 80 }}>
            “
          </span>
          {stars && (
            <span style={{ display: 'flex', gap: 6 }} aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={landscape ? 30 : 36} fill={accent} strokeWidth={0} />
              ))}
            </span>
          )}
        </div>

        <p
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            margin: 0,
            fontSize: quoteFontSize(item.text, size),
            lineHeight: 1.35,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {item.text}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, minWidth: 0 }}>
            {showAvatar ? (
              <img
                src={item.avatarUrl}
                alt=""
                crossOrigin="anonymous"
                onError={() => setAvatarFailed(true)}
                style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: accent,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initialsOf(item.name)}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{item.name}</div>
              {handle && <div style={{ fontSize: 28, color: theme.muted }}>{handle}</div>}
            </div>
          </div>
          {brand.trim() && (
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.muted, whiteSpace: 'nowrap' }}>{brand}</div>
          )}
        </div>
      </div>
    </div>
  )
}
