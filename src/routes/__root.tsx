import React from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { Provider as QueryProviderWrapper } from '@/integrations/tanstack-query/root-provider'

import appCss from '../styles.css?url'
import { NotFound } from '@/components/layout/NotFound'
import { PrivacyNotice } from '@/components/PrivacyNotice'
import { Toaster } from '@/components/ui/sonner'
import { CLARITY_PROJECT_ID, GA4_MEASUREMENT_ID } from '@/lib/analytics'
import { consentBootScript, getConsentRegion } from '@/lib/consent'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    const siteUrl = 'https://postloom.studio'
    const ogImage = `${siteUrl}/og-image.png`
    
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Postloom - Free Tweet Card Generator | Social Media Card Creator | Instagram Post Maker',
        },
        {
          name: 'description',
          content: 'Free tweet card generator and social media card creator. Design professional Instagram posts, Twitter cards, LinkedIn graphics, and animated GIFs. No design skills needed. 100% free forever - no watermarks, unlimited exports.',
        },
        {
          name: 'keywords',
          content: 'tweet card generator, social media card creator, instagram post maker, twitter card designer, social media graphics tool, tweet design tool, post card generator, social media content creator, tweet image maker, instagram story card, linkedin post designer, free tweet card maker, animated tweet card, social media post designer, tweet card creator, instagram card maker, twitter post designer, social media template, free social media tool, tweet graphics generator, instagram post creator, social media design tool, tweet card maker free, instagram story maker, linkedin post creator, twitter card generator free, social media card maker, post design tool, tweet visual creator, instagram carousel maker',
        },
        {
          name: 'author',
          content: 'Postloom',
        },
        {
          name: 'robots',
          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        // Open Graph / Facebook
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: siteUrl,
        },
        {
          property: 'og:title',
          content: 'Postloom - Free Tweet Card Generator | Social Media Card Creator',
        },
        {
          property: 'og:description',
          content: 'Free tweet card generator and social media card creator. Design professional Instagram posts, Twitter cards, LinkedIn graphics, and animated GIFs. No design skills needed. 100% free forever.',
        },
        {
          property: 'og:image',
          content: ogImage,
        },
        {
          property: 'og:image:width',
          content: '1200',
        },
        {
          property: 'og:image:height',
          content: '630',
        },
        {
          property: 'og:site_name',
          content: 'Postloom',
        },
        // Twitter Card
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:url',
          content: siteUrl,
        },
        {
          name: 'twitter:title',
          content: 'Postloom - Free Tweet Card Generator | Social Media Card Creator',
        },
        {
          name: 'twitter:description',
          content: 'Free tweet card generator and social media card creator. Design professional Instagram posts, Twitter cards, LinkedIn graphics, and animated GIFs. No design skills needed. 100% free forever.',
        },
        {
          name: 'twitter:image',
          content: ogImage,
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/logo192.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '192x192',
          href: '/logo192.png',
        },
        // Canonical URLs are set per route so each page can be indexed on its own
      ],
    }
  },

  // Visitor's country decides whether analytics need opt-in. Read once per page load.
  loader: () => getConsentRegion(),
  staleTime: Infinity,
  shouldReload: false,

  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  const { optIn } = Route.useLoaderData()

  // Suppress AbortError from unhandled promise rejections
  // These are normal when requests are cancelled during navigation/component unmount
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      // Suppress AbortError - these are expected during navigation/component unmount
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        event.preventDefault()
        return
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Apply the theme before first paint: light unless the visitor chose dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')==='dark')}catch(e){}`,
          }}
        />
        {/* Consent first: analytics only load once allowed (see src/lib/consent.ts) */}
        <script
          dangerouslySetInnerHTML={{
            __html: consentBootScript({ optIn, gaId: GA4_MEASUREMENT_ID, clarityId: CLARITY_PROJECT_ID }),
          }}
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Postloom',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Free tweet card generator and social media card creator. Design professional Instagram posts, Twitter cards, LinkedIn graphics, and animated GIFs. No design skills needed. 100% free forever.',
              url: 'https://postloom.studio',
              image: 'https://postloom.studio/og-image.png',
              featureList: [
                'Tweet Card Generator',
                'Social Media Card Creator',
                'Instagram Post Maker',
                'Twitter Card Designer',
                'LinkedIn Post Creator',
                'Animated GIF Export',
                'PNG Export',
                'Free Forever',
                'No Watermarks',
                'No Design Skills Required',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <QueryProviderWrapper>
          <Outlet />
        </QueryProviderWrapper>
        <Toaster />
        <Scripts />
        <PrivacyNotice optIn={optIn} />
      </body>
    </html>
  )
}
