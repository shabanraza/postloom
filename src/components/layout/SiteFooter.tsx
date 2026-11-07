import { Link } from '@tanstack/react-router'
import { Container } from './Container'
import { PostloomLogo } from '@/components/PostloomLogo'
import { LANDING_PAGES, TOOLS } from '@/lib/tools'

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
        <div className="flex gap-12">
          <FooterLinks label="Tools" links={TOOLS} />
          <FooterLinks label="Popular" links={LANDING_PAGES} />
        </div>
      </Container>
      <Container className="border-t border-border py-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Postloom</p>
      </Container>
    </footer>
  )
}

function FooterLinks({
  label,
  links,
}: {
  label: string
  links: ReadonlyArray<{ path: (typeof TOOLS)[number]['path'] | (typeof LANDING_PAGES)[number]['path']; name: string }>
}) {
  return (
    <nav aria-label={label} className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
