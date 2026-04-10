import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Film,
  Layers,
  Palette,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PostloomLogo } from '@/components/PostloomLogo'
import { trackCtaClick } from '@/lib/analytics'
import { ThemeToggle } from '@/routes/tweet-card-generator/-components/ThemeToggle'

export const Route = createFileRoute('/')({ component: HomePage })

const features = [
  {
    icon: Wand2,
    title: 'Smart Presets',
    description: 'Start from ready-made card styles and tweak instantly.',
  },
  {
    icon: Palette,
    title: 'Design Freedom',
    description: 'Tune colors, spacing, layout, and typography in one editor.',
  },
  {
    icon: Film,
    title: 'Animated Export',
    description: 'Export static PNGs or attention-grabbing GIF versions.',
  },
  {
    icon: Download,
    title: 'Unlimited Downloads',
    description: 'No watermark and no usage cap for your creations.',
  },
]

const highlights = [
  '100% free forever',
  'No account required',
  'PNG + GIF export',
  'Built for X, Threads, LinkedIn',
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
      'You can export your design as PNG for static posts or GIF for animated content.',
  },
  {
    question: 'Which platforms are supported?',
    answer:
      'The generator is optimized for social visuals used on X, Threads, and LinkedIn.',
  },
]

function HomePage() {
  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.12),transparent_34%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#030711]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <PostloomLogo size="md" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/tweet-card-generator" onClick={() => trackCtaClick('get_started', 'nav')}>
              <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-200">
                Open Editor
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Badge className="mb-5 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-cyan-100">
            Free Tweet Card Generator
          </Badge>

          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Design social cards that look like real products, not templates.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Postloom gives you a focused editor for polished tweet cards and social visuals.
            Fast workflow, clean output, and zero paywall.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tweet-card-generator"
              onClick={() => trackCtaClick('get_started_free', 'hero')}
            >
              <Button
                size="lg"
                className="rounded-full bg-white px-7 text-slate-900 hover:bg-slate-200"
              >
                Start Designing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                <CheckCircle2 className="mr-2 inline h-4 w-4 text-cyan-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-indigo-500/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#020617] shadow-[0_24px_80px_-24px_rgba(34,211,238,0.4)]">
            <img
              src="/assets/landing-editor-screenshot.png"
              alt="Postloom editor screenshot showing tweet card generator interface"
              title="Postloom Editor Screenshot"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="border-white/10 bg-white/[0.03] text-white backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400/10">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-14">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Frequently asked questions</h2>
          <p className="mt-2 text-slate-300">Everything you need before you start creating.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="border-b border-white/10"
            >
              <AccordionTrigger className="text-left text-slate-100">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-slate-300">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto mb-16 w-full max-w-5xl px-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-indigo-500/10 px-6 py-10 text-center">
          <h3 className="text-3xl font-semibold text-white">Ready to make your first card?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Open the editor and export your first polished social card in minutes.
          </p>
          <Link to="/tweet-card-generator" onClick={() => trackCtaClick('start_creating', 'footer_cta')}>
            <Button className="mt-6 rounded-full bg-white px-7 text-slate-900 hover:bg-slate-200">
              Start Creating
              <Layers className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
