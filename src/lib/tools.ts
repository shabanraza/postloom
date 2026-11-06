import { GalleryHorizontal, MessageSquareHeart, MessageSquareQuote } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Tool {
  /** Route path, also used in sitemap.xml and llms.txt */
  path: '/tweet-card-generator' | '/carousel-maker' | '/testimonial-generator'
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
  {
    path: '/testimonial-generator',
    name: 'Testimonial Generator',
    description: 'Turn tweets and quotes into testimonial images and a wall of love.',
    icon: MessageSquareHeart,
  },
]

export interface LandingPage {
  /** Route path, also used in sitemap.xml and llms.txt */
  path: '/tweet-to-image' | '/thread-to-carousel' | '/linkedin-carousel-maker' | '/instagram-carousel-maker' | '/wall-of-love-generator'
  /** Short link text for the footer */
  name: string
  /** The tool the page runs on */
  tool: Tool['path']
}

/**
 * Single-purpose landing pages: each targets one search phrase and runs an
 * existing tool with its own copy and defaults. Linked from the footer, not the
 * header menu. Also add each URL to public/sitemap.xml and public/llms.txt.
 */
export const LANDING_PAGES: ReadonlyArray<LandingPage> = [
  { path: '/tweet-to-image', name: 'Tweet to image', tool: '/tweet-card-generator' },
  { path: '/thread-to-carousel', name: 'Thread to carousel', tool: '/carousel-maker' },
  { path: '/linkedin-carousel-maker', name: 'LinkedIn carousel maker', tool: '/carousel-maker' },
  { path: '/instagram-carousel-maker', name: 'Instagram carousel maker', tool: '/carousel-maker' },
  { path: '/wall-of-love-generator', name: 'Wall of love generator', tool: '/testimonial-generator' },
]

export const SITE_URL = 'https://postloom.studio'
