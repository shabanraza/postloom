/**
 * Hostname detection utilities for subdomain routing
 */

export const MAIN_DOMAIN = 'postloom.studio'
export const APP_SUBDOMAIN = 'app.postloom.studio'

/**
 * Check if the current hostname is the app subdomain
 */
export function isAppSubdomain(hostname: string): boolean {
  // Handle localhost for development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    // In development, use path-based routing
    return false
  }

  return hostname === APP_SUBDOMAIN || hostname.startsWith('app.')
}

/**
 * Check if the current hostname is the main domain
 */
export function isMainDomain(hostname: string): boolean {
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    return true
  }

  return hostname === MAIN_DOMAIN || !hostname.startsWith('app.')
}

/**
 * Get the appropriate redirect URL for auth
 */
export function getAuthRedirectUrl(hostname: string): string {
  if (isAppSubdomain(hostname)) {
    return '/'
  }
  return `https://${APP_SUBDOMAIN}/`
}

/**
 * Get the main site URL
 */
export function getMainSiteUrl(hostname: string): string {
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    return 'http://localhost:4000'
  }
  return `https://${MAIN_DOMAIN}`
}

/**
 * Get the app site URL
 */
export function getAppSiteUrl(hostname: string): string {
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    return 'http://localhost:4000/app'
  }
  return `https://${APP_SUBDOMAIN}`
}
