import { Link } from '@tanstack/react-router'
import { Container } from './Container'
import { PostloomLogo } from '@/components/PostloomLogo'
import { TOOLS } from '@/lib/tools'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <PostloomLogo size="sm" />
          <p className="max-w-xs text-sm text-muted-foreground">
            Free tools for social media visuals. No sign-up, no watermark.
          </p>
        </div>
        <nav aria-label="Tools" className="space-y-2">
          <p className="text-sm font-medium">Tools</p>
          <ul className="space-y-1.5">
            {TOOLS.map((tool) => (
              <li key={tool.path}>
                <Link
                  to={tool.path}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-border py-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Postloom</p>
      </Container>
    </footer>
  )
}
