import { DemoCard } from './DemoCard'
import type { CardStyle } from './DemoCard'
import { cn } from '@/lib/utils'

const EXAMPLES: Array<{ text: string; name: string; handle: string; style: CardStyle }> = [
  { text: 'Consistency beats intensity. Post a little, every day.', name: 'Maya Chen', handle: 'mayawrites', style: 'light' },
  { text: 'Hot take: your landing page is too long.', name: 'Dev Patel', handle: 'devships', style: 'dark' },
  { text: 'We just crossed 1,000 customers. Thank you all.', name: 'Northwind', handle: 'northwindhq', style: 'gradient' },
  { text: 'Read more books than tweets this year.', name: 'Sam Ortiz', handle: 'samreads', style: 'sunset' },
  { text: 'The fastest way to learn is to teach in public.', name: 'Lena Kim', handle: 'lenacodes', style: 'dark' },
  { text: 'New feature: export your cards as animated GIFs.', name: 'Postloom', handle: 'postloom', style: 'gradient' },
  { text: 'Design is how it works, and how it shares.', name: 'Omar Haddad', handle: 'omardesigns', style: 'light' },
  { text: 'Small daily wins compound into big launches.', name: 'Ivy Brooks', handle: 'ivybuilds', style: 'sunset' },
]

/** Two rows of example cards drifting in opposite directions. Pauses on hover. */
export function ExampleMarquee() {
  const half = Math.ceil(EXAMPLES.length / 2)
  return (
    <div
      className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      aria-label="Example cards made with Postloom"
    >
      <Row items={EXAMPLES.slice(0, half)} />
      <Row items={EXAMPLES.slice(half)} reverse />
    </div>
  )
}

function Row({ items, reverse = false }: { items: typeof EXAMPLES; reverse?: boolean }) {
  return (
    <div className="group flex overflow-hidden">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            'animate-marquee flex shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
          )}
        >
          {items.map((ex) => (
            <li key={ex.handle} className="w-[300px] shrink-0 overflow-hidden rounded-xl">
              <DemoCard {...ex} frame={16} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
