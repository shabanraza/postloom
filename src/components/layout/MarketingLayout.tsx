import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/** Shell for the homepage and every tool page: shared header, main, footer. */
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
