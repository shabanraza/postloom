/**
 * Centralized Analytics Utility
 * Tracks user actions for Postloom Tweet Studio
 * 
 * Event Categories:
 * - export_* : Download/export events (PNG, GIF)
 * - tool_* : Tool interactions (studio opened, session duration)
 * - design_* : Design changes (theme, background, canvas size)
 * - import_* : Content imports (tweet URL)
 */

// Declare global analytics functions
declare global {
  interface Window {
    // Cloudflare Web Analytics (auto-injected for page views)
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
    // Session tracking
    _postloom_session_start?: number
  }
}

// Track session start for duration calculation
let sessionStartTime: number | null = null

/**
 * Track a custom event to Google Analytics 4
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean | undefined>
): void {
  // Clean undefined values
  const cleanedParams = eventParams 
    ? Object.fromEntries(
        Object.entries(eventParams).filter(([, v]) => v !== undefined)
      )
    : undefined

  // Track in Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, cleanedParams)
  }

  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('📊 Analytics:', eventName, cleanedParams)
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

// ============================================
// TOOL USAGE TRACKING
// ============================================

/**
 * Track when user opens the Tweet Studio tool
 */
export function trackToolOpen(): void {
  sessionStartTime = Date.now()
  if (typeof window !== 'undefined') {
    window._postloom_session_start = sessionStartTime
  }
  trackEvent('tool_open', {
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track when user leaves the tool (session end)
 */
export function trackToolClose(): void {
  const startTime = sessionStartTime || (typeof window !== 'undefined' ? window._postloom_session_start : null)
  const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
  
  trackEvent('tool_close', {
    session_duration_seconds: duration,
  })
}

/**
 * Track tab/panel interactions
 */
export function trackTabView(tabName: string): void {
  trackEvent('tab_view', {
    tab_name: tabName,
  })
}

// ============================================
// EXPORT/DOWNLOAD TRACKING
// ============================================

/**
 * Track export start (user clicked export)
 */
export function trackExportStart(format: 'png' | 'gif', width: number, height: number): void {
  trackEvent('export_start', {
    format,
    width,
    height,
    dimensions: `${width}x${height}`,
  })
}

/**
 * Track successful export (download completed)
 */
export function trackExport(
  format: 'png' | 'gif',
  width: number,
  height: number
): void {
  trackEvent('export_complete', {
    format,
    width,
    height,
    dimensions: `${width}x${height}`,
  })
}

/**
 * Track export failure
 */
export function trackExportError(
  format: 'png' | 'gif',
  errorMessage: string
): void {
  trackEvent('export_error', {
    format,
    error_message: errorMessage.slice(0, 100), // Limit error message length
  })
}

/**
 * Track copy to clipboard action
 */
export function trackCopyToClipboard(success: boolean): void {
  trackEvent('copy_to_clipboard', {
    success,
  })
}

// ============================================
// IMPORT TRACKING
// ============================================

/**
 * Track tweet import attempt
 */
export function trackTweetImport(success: boolean, error?: string): void {
  trackEvent('tweet_import', {
    success,
    error_message: error?.slice(0, 100),
  })
}

// ============================================
// DESIGN CHANGES TRACKING
// ============================================

/**
 * Track design preset selection (card style)
 */
export function trackDesignPreset(presetId: string): void {
  trackEvent('design_preset_change', {
    preset_id: presetId,
  })
}

/**
 * Track theme change (light/dark/dim)
 */
export function trackThemeChange(theme: 'light' | 'dark' | 'dim'): void {
  trackEvent('theme_change', {
    theme,
  })
}

/**
 * Track card theme change
 */
export function trackCardThemeChange(theme: string): void {
  trackEvent('card_theme_change', {
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
 * Track canvas size/template change
 */
export function trackCanvasSizeChange(
  templateName: string,
  width: number,
  height: number
): void {
  trackEvent('canvas_size_change', {
    template: templateName,
    width,
    height,
    dimensions: `${width}x${height}`,
  })
}

/**
 * Track export size preset selection
 */
export function trackExportSizeChange(preset: string, width: number, height: number): void {
  trackEvent('export_size_change', {
    preset,
    width,
    height,
    dimensions: `${width}x${height}`,
  })
}

// ============================================
// ANIMATION TRACKING
// ============================================

/**
 * Track animation settings change
 */
export function trackAnimationChange(settings: {
  type?: string
  speed?: number
  fps?: number
  loop?: boolean
}): void {
  trackEvent('animation_change', {
    type: settings.type,
    speed: settings.speed,
    fps: settings.fps,
    loop: settings.loop,
  })
}

// ============================================
// USER ENGAGEMENT TRACKING
// ============================================

/**
 * Track when user modifies tweet content
 */
export function trackContentEdit(field: 'text' | 'name' | 'username' | 'metrics'): void {
  trackEvent('content_edit', {
    field,
  })
}

/**
 * Track CTA button clicks on landing page
 */
export function trackCtaClick(ctaName: string, location: string): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location,
  })
}

/**
 * Track feature discovery/usage
 */
export function trackFeatureUsed(featureName: string): void {
  trackEvent('feature_used', {
    feature: featureName,
  })
}

