/**
 * Centralized Analytics Utility
 * Supports Cloudflare Web Analytics and Google Analytics 4
 */

// Declare global analytics functions
declare global {
  interface Window {
    // Cloudflare Web Analytics
    cfBeacon?: {
      push: (data: unknown) => void
    }
    // Google Analytics 4
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void {
  // Track in Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }

  // Cloudflare Web Analytics doesn't support custom events directly
  // But we can log for debugging
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', eventName, eventParams)
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID || '', {
      page_path: path,
    })
  }
}

/**
 * Track tweet import
 */
export function trackTweetImport(success: boolean, error?: string): void {
  trackEvent('tweet_import', {
    success,
    ...(error && { error_message: error }),
  })
}

/**
 * Track export (PNG or GIF)
 */
export function trackExport(
  format: 'png' | 'gif',
  width: number,
  height: number
): void {
  trackEvent('export', {
    format,
    width,
    height,
  })
}

/**
 * Track design preset selection
 */
export function trackDesignPreset(presetId: string): void {
  trackEvent('design_preset', {
    preset_id: presetId,
  })
}

/**
 * Track theme change
 */
export function trackThemeChange(theme: 'light' | 'dark'): void {
  trackEvent('theme_change', {
    theme,
  })
}

/**
 * Track background type change
 */
export function trackBackgroundChange(backgroundType: string): void {
  trackEvent('background_change', {
    background_type: backgroundType,
  })
}

/**
 * Track animation settings change
 */
export function trackAnimationChange(settings: {
  type?: string
  speed?: number
  fps?: number
}): void {
  trackEvent('animation_change', settings)
}

