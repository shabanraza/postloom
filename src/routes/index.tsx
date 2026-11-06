import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Download, Film, Palette, Wand2 } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { FaqList } from '@/components/layout/ToolPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trackCtaClick } from '@/lib/analytics'
import { TOOLS } from '@/lib/tools'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://postloom.studio/' }],
  }),
  component: HomePage,
})

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
    <MarketingLayout>
      <section className="hero-glow">
        <Container className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <Badge variant="secondary" className="mb-5 rounded-full">
              Free social media tools
            </Badge>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Design social cards that look like real products, not templates.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Postloom gives you focused editors for polished tweet cards, carousels and social
              visuals. Fast workflow, clean output, and zero paywall.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link
                  to="/tweet-card-generator"
                  onClick={() => trackCtaClick('get_started_free', 'hero')}
                >
                  Start Designing
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/carousel-maker" onClick={() => trackCtaClick('carousel_maker', 'hero')}>
                  Make a Carousel
                </Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                >
                  <CheckCircle2 className="size-4 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-brand/10">
            <img
              src="/assets/landing-editor-screenshot.png"
              alt="Postloom editor screenshot showing tweet card generator interface"
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              onClick={() => trackCtaClick(tool.path.slice(1), 'home_tools')}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition-colors group-hover:border-brand/50">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-brand/10">
                    <tool.icon className="size-5 text-brand" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {tool.name}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Why Postloom</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-brand/10">
                  <feature.icon className="size-5 text-brand" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="max-w-3xl py-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <FaqList faqs={faqs} className="mt-6" />
      </Container>

      <Container className="pb-16">
        <div className="hero-glow rounded-xl border border-border px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to make your first card?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Open the editor and export your first polished social card in minutes.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full px-7">
            <Link
              to="/tweet-card-generator"
              onClick={() => trackCtaClick('start_creating', 'footer_cta')}
            >
              Start Creating
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Container>
    </MarketingLayout>
  )
}
