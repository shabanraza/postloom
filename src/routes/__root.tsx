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
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Postloom',
      },
      {
        name: 'description',
        content: 'Create beautiful tweet cards for Instagram, LinkedIn, and more',
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
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  // Initialize analytics on client side
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID
    const cfToken = import.meta.env.VITE_CF_BEACON_TOKEN

    // Load Google Analytics 4
    if (ga4Id) {
      // Load gtag script
      const script1 = document.createElement('script')
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
      script1.async = true
      document.head.appendChild(script1)

      // Initialize gtag
      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag = gtag as typeof window.gtag
      gtag('js', new Date())
      gtag('config', ga4Id, {
        page_path: window.location.pathname,
      })
    }

    // Load Cloudflare Web Analytics
    if (cfToken) {
      const script2 = document.createElement('script')
      script2.src = 'https://static.cloudflareinsights.com/beacon.min.js'
      script2.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken }))
      script2.defer = true
      document.head.appendChild(script2)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Outlet />
        <Scripts />
        <PrivacyNotice />
      </body>
    </html>
  )
}
