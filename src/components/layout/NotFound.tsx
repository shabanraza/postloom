import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Container } from './Container'
import { MarketingLayout } from './MarketingLayout'
import { Button } from '@/components/ui/button'
import { TOOLS } from '@/lib/tools'

/** Shown for any unknown URL: points visitors back to the tools. */
export function NotFound() {
  return (
    <MarketingLayout>
      <Container className="py-20 sm:py-28">
        <p className="text-sm font-medium text-brand">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          This page doesn't exist or has moved. Try one of the free tools instead.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <li key={tool.path}>
              <Link
                to={tool.path}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <tool.icon className="size-5 text-brand" />
                <span className="mt-3 flex items-center gap-2 font-semibold">
                  {tool.name}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{tool.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-8">
          <Link to="/">Back to home</Link>
        </Button>
      </Container>
    </MarketingLayout>
  )
}
