import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, ClipboardPaste, Download, Palette } from 'lucide-react'
import { ExampleMarquee } from './-home/ExampleMarquee'
import { LiveDemo } from './-home/LiveDemo'
import { Reveal } from './-home/Reveal'
import { ToolsBento } from './-home/ToolsBento'
import { Container } from '@/components/layout/Container'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { FaqList } from '@/components/layout/ToolPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { trackCtaClick } from '@/lib/analytics'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://postloom.studio/' }],
  }),
  component: HomePage,
})

const highlights = ['Free forever', 'No sign-up', 'No watermark']

const steps = [
  { icon: ClipboardPaste, title: 'Paste', text: 'Write a tweet, paste a tweet URL, or drop in a whole thread.' },
  { icon: Palette, title: 'Style', text: 'Pick a preset, then tune background, theme, size and brand colors.' },
  { icon: Download, title: 'Export', text: 'Download PNG, animated GIF or a carousel PDF, ready to post.' },
]

const faqs = [
  {
    question: 'Is Postloom really free?',
    answer:
      'Yes. Postloom is fully free, with no hidden paywall, no watermark, and no export limit.',
  },
  {
    question: 'Do I need design skills?',
    answer:
      'No. You can start from presets and make quick edits with visual controls in the editor.',
  },
  {
    question: 'What can I export?',
    answer:
      'Tweet cards export as PNG or animated GIF. Carousels export as PNG slides for Instagram or one PDF for LinkedIn.',
  },
  {
    question: 'Which platforms are supported?',
    answer:
      'X, Threads, LinkedIn and Instagram, with export sizes for posts, stories and carousels.',
  },
]

function HomePage() {
  return (
    <MarketingLayout>
      <section className="hero-glow relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_minmax(0,500px)] lg:items-center lg:py-20">
          <div>
            <Badge variant="secondary" className="mb-5 rounded-full">
              Free social media tools
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Turn tweets into{' '}
              <span className="text-brand">scroll-stopping</span>{' '}
              visuals.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Design tweet cards, carousels and animated posts in seconds. Try it right here, then
              open the full editor when you want more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link
                  to="/tweet-card-generator"
                  onClick={() => trackCtaClick('get_started_free', 'hero')}
                >
                  Open the editor
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/carousel-maker" onClick={() => trackCtaClick('carousel_maker', 'hero')}>
                  Make a carousel
                </Link>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LiveDemo />
        </Container>
      </section>

      <section className="border-y border-border py-12" aria-labelledby="examples-heading">
        <Container>
          <h2 id="examples-heading" className="mb-8 text-center text-sm font-medium text-muted-foreground">
            Cards people make with Postloom
          </h2>
        </Container>
        <ExampleMarquee />
      </section>

      <Container className="py-16 sm:py-20">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">One studio, every format</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Free tools that share one editor and export engine, built for how creators actually post.
          </p>
        </Reveal>
        <div className="mt-10">
          <ToolsBento />
        </div>
      </Container>

      <Container className="py-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
        </Reveal>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="h-full rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
                    <step.icon className="size-5 text-brand" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>

      <Container className="max-w-3xl py-16">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <FaqList faqs={faqs} className="mt-8" />
        </Reveal>
      </Container>

      <Container className="pb-20">
        <Reveal>
          <div className="hero-glow rounded-2xl border border-border px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next post deserves better than a screenshot.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Free, no account, no watermark. Make your first card in under a minute.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full px-8">
              <Link
                to="/tweet-card-generator"
                onClick={() => trackCtaClick('start_creating', 'footer_cta')}
              >
                Start creating
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </MarketingLayout>
  )
}
