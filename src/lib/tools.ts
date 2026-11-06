import { GalleryHorizontal, MessageSquareQuote } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Tool {
  /** Route path, also used in sitemap.xml and llms.txt */
  path: '/tweet-card-generator' | '/carousel-maker'
  name: string
  /** One line shown in menus and tool cards */
  description: string
  icon: LucideIcon
}

/**
 * Every public tool. Adding a tool here puts it in the header menu,
 * footer and homepage grid. Also add its URL to public/sitemap.xml and
 * public/llms.txt (tools.test.ts checks they stay in sync).
 */
export const TOOLS: ReadonlyArray<Tool> = [
  {
    path: '/tweet-card-generator',
    name: 'Tweet Card Generator',
    description: 'Turn a tweet into a polished image or animated GIF.',
    icon: MessageSquareQuote,
  },
  {
    path: '/carousel-maker',
    name: 'Carousel Maker',
    description: 'Turn a thread into Instagram slides or a LinkedIn PDF.',
    icon: GalleryHorizontal,
  },
]

export const SITE_URL = 'https://postloom.studio'
