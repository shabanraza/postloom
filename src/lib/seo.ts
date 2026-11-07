import { SITE_URL } from './tools'

/**
 * Route head() for a public page: unique title, description, OG/Twitter tags
 * and its own canonical. Every indexable page should use this.
 */
export function pageHead({ path, title, description }: { path: string; title: string; description: string }) {
  const url = `${SITE_URL}${path}`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { name: 'twitter:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
