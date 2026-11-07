/**
 * Analytics helpers for Google Analytics 4.
 *
 * Every export event (export_start, export_complete, export_error) carries:
 * - tool:   which tool made it (tweet_card, carousel, testimonial, tweet_demo)
 * - format: what was produced (png, gif, pdf, embed, clipboard)
 * so GA can compare tools side by side. `tool`, `format`, `slides`, `theme`,
 * `style`, `size`, `cta_name` and `location` are registered as custom
 * dimensions in GA; a new parameter needs registering there too before it
 * shows in reports. export_complete is the key event.
 *
 * GA only sends hits from postloom.studio (see __root.tsx); in dev, events
 * are logged to the console instead.
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: Array<unknown>
    _postloom_session_start?: number
  }
}

/** GA4 measurement ID: env var, falling back to the production property */
export const GA4_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-7T3RYZQR2M').trim()

/** Microsoft Clarity project ID (session recordings, heatmaps). Empty means Clarity is off. */
export const CLARITY_PROJECT_ID: string = (import.meta.env.VITE_CLARITY_PROJECT_ID || 'z9sugljr4c').trim()

export type ToolId = 'tweet_card' | 'carousel' | 'testimonial' | 'tweet_demo'
export type ExportFormat = 'png' | 'gif' | 'pdf' | 'embed' | 'clipboard'
type Params = Record<string, string | number | boolean | undefined>

export function trackEvent(eventName: string, eventParams?: Params): void {
  const cleanedParams = eventParams
    ? Object.fromEntries(Object.entries(eventParams).filter(([, v]) => v !== undefined))
    : undefined

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, cleanedParams)
  }

  sendToClarity(eventName, cleanedParams)

  if (import.meta.env.DEV) {
    console.log('📊 Analytics:', eventName, cleanedParams)
  }
}

/** Params that become Clarity tags, so recordings can be filtered by them */
const CLARITY_TAGS = ['tool', 'format', 'cta_name'] as const

/**
 * Mirror an event into Microsoft Clarity: a custom event (filter recordings by
 * "Custom events"), tags for the tool and format, and a priority upgrade for
 * exports so those sessions are kept and recorded in full. window.clarity only
 * exists once analytics are allowed (see consentBootScript), so this respects consent.
 */
function sendToClarity(eventName: string, params?: Params): void {
  if (typeof window === 'undefined' || !window.clarity) return
  window.clarity('event', eventName)
  for (const key of CLARITY_TAGS) {
    const value = params?.[key]
    if (value !== undefined) window.clarity('set', key, String(value))
  }
  if (eventName === 'export_complete') window.clarity('upgrade', eventName)
}

// ============================================
// EXPORTS (the main success signal)
// ============================================

export function trackExportStart(tool: ToolId, format: ExportFormat, params?: Params): void {
  trackEvent('export_start', { tool, format, ...params })
}

export function trackExportComplete(tool: ToolId, format: ExportFormat, params?: Params): void {
  trackEvent('export_complete', { tool, format, ...params })
}

export function trackExportError(
  tool: ToolId,
  format: ExportFormat,
  error: unknown,
  params?: Params
): void {
  const message = error instanceof Error ? error.message : String(error)
  trackEvent('export_error', { tool, format, error_message: message.slice(0, 100), ...params })
}

/** Width/height params for the tweet card editor's exports */
export function sizeParams(width: number, height: number): Params {
  return { width, height, dimensions: `${width}x${height}` }
}

// ============================================
// EDITOR SESSION
// ============================================

let sessionStartTime: number | null = null

export function trackToolOpen(): void {
  sessionStartTime = Date.now()
  if (typeof window !== 'undefined') window._postloom_session_start = sessionStartTime
  trackEvent('tool_open', { tool: 'tweet_card' })
}

export function trackToolClose(): void {
  const startTime =
    sessionStartTime || (typeof window !== 'undefined' ? window._postloom_session_start : null)
  const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
  trackEvent('tool_close', { tool: 'tweet_card', session_duration_seconds: duration })
}

export function trackTweetImport(success: boolean, error?: string): void {
  trackEvent('tweet_import', { success, error_message: error?.slice(0, 100) })
}

// ============================================
// EDITOR DESIGN CHANGES
// ============================================

export function trackDesignPreset(presetId: string): void {
  trackEvent('design_preset_change', { preset_id: presetId })
}

export function trackThemeChange(theme: 'light' | 'dark' | 'dim'): void {
  trackEvent('theme_change', { theme })
}

export function trackCardThemeChange(theme: string): void {
  trackEvent('card_theme_change', { theme })
}

export function trackBackgroundChange(backgroundType: string): void {
  trackEvent('background_change', { background_type: backgroundType })
}

export function trackCanvasSizeChange(templateName: string, width: number, height: number): void {
  trackEvent('canvas_size_change', { template: templateName, ...sizeParams(width, height) })
}

export function trackExportSizeChange(preset: string, width: number, height: number): void {
  trackEvent('export_size_change', { preset, ...sizeParams(width, height) })
}

// ============================================
// NAVIGATION
// ============================================

/** Clicks on buttons and links that lead into a tool */
export function trackCtaClick(ctaName: string, location: string): void {
  trackEvent('cta_click', { cta_name: ctaName, location })
}
