import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { useEffect } from 'react'

import appCss from '../styles.css?url'
import { PrivacyNotice } from '@/components/PrivacyNotice'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCRouter } from '@/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    const siteUrl = 'https://postloom.studio'
    const ogImage = `${siteUrl}/postloom_light.png`
    
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
        {
          rel: 'canonical',
          href: siteUrl,
        },
      ],
    }
  },

  component: RootComponent,
})

function RootComponent() {
  // Initialize Google Analytics 4 on client side
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID

    // Load Google Analytics 4 - Standard Google format (exact match)
    if (ga4Id) {
      // Initialize dataLayer first (before script loads)
      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag = gtag as typeof window.gtag

      // Load gtag.js script (async)
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
      document.head.appendChild(script)

      // Configure GA4 immediately (matches Google's exact format)
      gtag('js', new Date())
      gtag('config', ga4Id)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
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
              image: 'https://postloom.studio/postloom_light.png',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                ratingCount: '100',
              },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Postloom',
              description: 'Free tweet card generator and social media card creator tool',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                bestRating: '5',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Outlet />
        <Scripts />
        <PrivacyNotice />
      </body>
    </html>
  )
}
