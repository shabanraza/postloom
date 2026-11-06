import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Film, ShieldCheck } from 'lucide-react'
import { Reveal } from './Reveal'
import { trackCtaClick } from '@/lib/analytics'
import { TOOLS } from '@/lib/tools'
import { cn } from '@/lib/utils'

const tool = (path: (typeof TOOLS)[number]['path']) => TOOLS.find((t) => t.path === path)!

const SLIDES = [
  { n: 1, text: 'How I grew to 10K readers in 6 months' },
  { n: 2, text: 'Write for one person. Answer one question.' },
  { n: 3, text: 'Ship on the same day, every week.' },
  { n: 4, text: 'Turn each issue into 3 carousels.' },
]

/** Asymmetric grid of tools and benefits. Tool names and copy come from the registry. */
export function ToolsBento() {
  const tweet = tool('/tweet-card-generator')
  const carousel = tool('/carousel-maker')

  return (
    <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-4">
      <Reveal className="md:col-span-2 md:row-span-2">
        <ToolTile path={tweet.path} className="h-full">
          <TileHeading icon={<tweet.icon className="size-5 text-brand" />} title={tweet.name}>
            {tweet.description}
          </TileHeading>
          <div className="mt-6 overflow-hidden rounded-lg border border-border shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
            <img
              src="/assets/landing-editor-screenshot.png"
              alt="Postloom tweet card editor"
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </ToolTile>
      </Reveal>

      <Reveal className="md:row-span-2" delay={0.08}>
        <ToolTile path={carousel.path} className="h-full">
          <TileHeading icon={<carousel.icon className="size-5 text-brand" />} title={carousel.name}>
            {carousel.description}
          </TileHeading>
          <SlideFlipper />
        </ToolTile>
      </Reveal>

      <Reveal delay={0.16}>
        <BenefitTile icon={<ShieldCheck className="size-5 text-brand" />} title="No watermark">
          Unlimited exports, no account, nothing to pay.
        </BenefitTile>
      </Reveal>

      <Reveal delay={0.24}>
        <BenefitTile icon={<Film className="size-5 text-brand" />} title="PNG, GIF and PDF">
          Sized for X, Threads, Instagram and LinkedIn.
        </BenefitTile>
      </Reveal>
    </div>
  )
}

function ToolTile({
  path,
  className,
  children,
}: {
  path: (typeof TOOLS)[number]['path']
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={path}
      onClick={() => trackCtaClick(path.slice(1), 'home_bento')}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {children}
    </Link>
  )
}

function TileHeading({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand/10">{icon}</div>
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        {title}
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

function BenefitTile({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6">
      <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">{icon}</div>
      <div>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}

/** Carousel slides that advance on their own; static for reduced motion. */
function SlideFlipper() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 2400)
    return () => clearInterval(id)
  }, [reduce])

  const slide = SLIDES[index]
  return (
    <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3">
      <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-lg shadow-lg">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={slide.n}
            initial={reduce ? false : { x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.6 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col justify-between p-5 text-white"
            style={{ background: 'linear-gradient(145deg,#1d4ed8,#7c3aed)' }}
          >
            <span className="text-xs font-semibold opacity-80">@alexbuilds</span>
            <p className="text-lg leading-snug font-semibold">{slide.text}</p>
            <span className="text-xs opacity-80">
              {slide.n} / {SLIDES.length} {slide.n < SLIDES.length ? '· Swipe →' : ''}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {SLIDES.map((s, i) => (
          <span
            key={s.n}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-4 bg-brand' : 'w-1.5 bg-muted-foreground/30',
            )}
          />
        ))}
      </div>
    </div>
  )
}
