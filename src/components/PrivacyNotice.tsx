import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { OPEN_COOKIE_SETTINGS, readConsent, saveConsent } from '@/lib/consent'
import type { ConsentChoice } from '@/lib/consent'

/**
 * Cookie banner. Where the law needs opt-in (EEA, UK, Switzerland, Quebec) nothing
 * runs until "Accept", and Accept and Reject are equally easy. Elsewhere it
 * is a notice with an opt-out. A Global Privacy Control signal is treated as
 * an opt-out, so those visitors aren't asked. The footer's "Your privacy choices"
 * link (the label California's CPRA rules use) reopens it so anyone can change their mind.
 */
export function PrivacyNotice({ optIn }: { optIn: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const gpc = window.__postloomConsent?.gpc === true
    if (!readConsent() && !gpc) setShow(true)
    const reopen = () => setShow(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen)
  }, [])

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice)
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg"
    >
      <h2 id="cookie-title" className="text-sm font-semibold">
        {optIn ? 'Can we use analytics cookies?' : 'We use analytics'}
      </h2>
      <p id="cookie-text" className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {optIn
          ? 'With your OK we use Google Analytics and Microsoft Clarity to see which tools people use and fix what breaks. Nothing runs until you accept. '
          : 'We use Google Analytics and Microsoft Clarity to see which tools people use and fix what breaks. We never sell your data. '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => choose('declined')}>
          {optIn ? 'Reject' : 'Opt out'}
        </Button>
        <Button size="sm" onClick={() => choose('accepted')}>
          {optIn ? 'Accept' : 'OK'}
        </Button>
      </div>
    </div>
  )
}

/** Footer link that reopens the cookie banner, labelled the way US privacy laws expect */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
    >
      Your privacy choices
    </button>
  )
}
