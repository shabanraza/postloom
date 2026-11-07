import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Menu } from 'lucide-react'
import { Container } from './Container'
import { PostloomLogo } from '@/components/PostloomLogo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { trackCtaClick } from '@/lib/analytics'
import { TOOLS } from '@/lib/tools'
import { cn } from '@/lib/utils'

/**
 * Transparent over the hero at the top of the page, then a frosted bar with a
 * border once the page scrolls. Heroes use `-mt-14 pt-14` (the header height)
 * so their background runs behind it.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200',
        scrolled
          ? 'border-border bg-background/80 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link to="/" aria-label="Postloom home">
          <PostloomLogo size="md" />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden sm:inline-flex">
                Tools
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {TOOLS.map((tool) => (
                <DropdownMenuItem key={tool.path} asChild>
                  <Link
                    to={tool.path}
                    onClick={() => trackCtaClick(tool.path.slice(1), 'header_menu')}
                    className="flex items-start gap-3 py-2"
                  >
                    <tool.icon className="mt-0.5 size-4 text-brand" />
                    <span>
                      <span className="block text-sm font-medium">{tool.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link to="/tweet-card-generator" onClick={() => trackCtaClick('get_started', 'nav')}>
              Open Editor
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 sm:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Tools</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={() => trackCtaClick(tool.path.slice(1), 'mobile_menu')}
                    className="flex items-start gap-3 rounded-md p-2 hover:bg-accent"
                  >
                    <tool.icon className="mt-0.5 size-4 text-brand" />
                    <span>
                      <span className="block text-sm font-medium">{tool.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </Container>
    </header>
  )
}
