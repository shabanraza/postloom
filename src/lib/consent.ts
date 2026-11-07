import { createServerFn } from '@tanstack/react-start'
import { getRequest, getRequestHeader } from '@tanstack/react-start/server'

/**
 * Where analytics may only start after the visitor opts in:
 * - EEA, UK, Switzerland (GDPR / ePrivacy, UK GDPR + PECR, Swiss FADP)
 * - Quebec (Law 25: tracking that can profile or locate must be off by default)
 * Everywhere else, including the US and the rest of Canada (PIPEDA), analytics
 * run by default with a notice and an opt-out, and a Global Privacy Control
 * signal counts as opting out (CCPA/CPRA and the other US state laws).
 */
export const OPT_IN_COUNTRIES = new Set([
  // EU
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // Rest of the EEA, UK, Switzerland
  'IS', 'LI', 'NO', 'GB', 'CH',
])

/** Provinces/states (ISO 3166-2 subdivision, as Cloudflare reports it) that need opt-in */
export const OPT_IN_REGIONS = new Set(['CA-QC'])

/**
 * Whether a visitor needs opt-in consent, from Cloudflare's country code and
 * region code (e.g. 'CA' + 'QC'). An unknown country takes the strict route.
 * In Canada an unknown province also takes the strict route, since it might be Quebec.
 */
export function needsOptIn(country: string | undefined | null, region?: string | null): boolean {
  if (!country || country.length !== 2 || country === 'XX' || country === 'T1') return true
  const c = country.toUpperCase()
  if (OPT_IN_COUNTRIES.has(c)) return true
  if (c === 'CA' && !region) return true
  return !!region && OPT_IN_REGIONS.has(`${c}-${region.toUpperCase()}`)
}

/** Read the visitor's location on the server from what Cloudflare attaches to the request */
export const getConsentRegion = createServerFn({ method: 'GET' }).handler(() => {
  const cf = (getRequest() as Request & { cf?: { country?: string; regionCode?: string } }).cf
  const country = cf?.country ?? getRequestHeader('cf-ipcountry')
  const region = cf?.regionCode ?? getRequestHeader('cf-region-code')
  return { optIn: needsOptIn(country, region) }
})

export const CONSENT_KEY = 'analytics-consent'
export type ConsentChoice = 'accepted' | 'declined'

/** Event the footer's "Cookie settings" link fires to reopen the banner */
export const OPEN_COOKIE_SETTINGS = 'postloom:cookie-settings'

/**
 * The inline <head> script. It decides consent before anything loads and only
 * injects Google Analytics and Microsoft Clarity once analytics are allowed,
 * so no analytics cookie is set and no request is sent before that.
 * window.__postloomStartAnalytics lets the banner start them after "Accept".
 */
export function consentBootScript({
  optIn,
  gaId,
  clarityId,
}: {
  optIn: boolean
  gaId: string
  clarityId: string
}): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
(function () {
  var OPT_IN = ${JSON.stringify(optIn)};
  var GA_ID = ${JSON.stringify(gaId)};
  var CLARITY_ID = ${JSON.stringify(clarityId)};
  // Only the live site reports, so localhost and preview visits stay out of the data
  var LIVE = /(^|\\.)postloom\\.studio$/.test(location.hostname);
  var choice = null;
  try { choice = localStorage.getItem(${JSON.stringify(CONSENT_KEY)}); } catch (e) {}
  var gpc = navigator.globalPrivacyControl === true;
  var allowed = choice === 'accepted' || (!choice && !OPT_IN && !gpc);
  window.__postloomConsent = { optIn: OPT_IN, gpc: gpc };
  gtag('consent', 'default', {
    analytics_storage: allowed ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  gtag('js', new Date());
  var started = false;
  window.__postloomStartAnalytics = function () {
    if (started || !LIVE) return;
    started = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    if (CLARITY_ID) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', CLARITY_ID);
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    }
  };
  if (allowed) window.__postloomStartAnalytics();
})();
`
}

declare global {
  interface Window {
    __postloomStartAnalytics?: () => void
    __postloomConsent?: { optIn: boolean; gpc: boolean }
    clarity?: (...args: Array<unknown>) => void
  }
}

/** Save the visitor's choice and apply it right away */
export function saveConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice)
  } catch {
    // storage blocked: the choice applies to this visit only
  }
  if (choice === 'accepted') {
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    window.__postloomStartAnalytics?.()
    window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })
  } else {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    // Clarity stops and erases its cookies when consent is withdrawn
    window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' })
    deleteAnalyticsCookies()
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY)
    return value === 'accepted' || value === 'declined' ? value : null
  } catch {
    return null
  }
}

/** Remove Google Analytics (_ga*) and Clarity (_clck, _clsk) cookies */
function deleteAnalyticsCookies(): void {
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0].trim()
    if (!/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
}
