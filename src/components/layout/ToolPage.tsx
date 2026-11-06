import { Container } from './Container'
import { MarketingLayout } from './MarketingLayout'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

export interface Faq {
  question: string
  answer: string
}

interface ToolPageProps {
  title: string
  description: string
  badges?: Array<string>
  /** The tool itself: usually <ToolWorkspace> */
  children: React.ReactNode
  steps: Array<string>
  faqs: Array<Faq>
}

/**
 * Template for every tool page: hero, workspace, how it works, FAQ.
 * FAQs also render as FAQPage structured data for search and AI assistants.
 */
export function ToolPage({ title, description, badges = [], children, steps, faqs }: ToolPageProps) {
  return (
    <MarketingLayout>
      <section className="hero-glow border-b border-border">
        <Container className="py-10 sm:py-14">
          {badges.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="rounded-full">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">{children}</Container>

      <Container className="grid gap-12 py-12 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-6 space-y-4">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                  {i + 1}
                </span>
                <p className="pt-1 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <FaqList faqs={faqs} className="mt-4" />
        </section>
      </Container>
    </MarketingLayout>
  )
}

/**
 * Two-column tool area: settings on the left, live preview on the right.
 * Stacks on small screens with the preview first.
 */
export function ToolWorkspace({
  controls,
  preview,
}: {
  controls: React.ReactNode
  preview: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      <div className="order-2 lg:order-1">{controls}</div>
      <div className="order-1 lg:order-2">{preview}</div>
    </div>
  )
}

export function FaqList({ faqs, className }: { faqs: Array<Faq>; className?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  return (
    <>
      <Accordion type="single" collapsible className={className}>
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.question} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
