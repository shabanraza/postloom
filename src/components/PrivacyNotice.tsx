import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GA4_MEASUREMENT_ID } from '@/lib/analytics'

function saveConsent(value: 'accepted' | 'declined') {
  try {
    localStorage.setItem('analytics-consent', value)
  } catch {
    // ignore: storage blocked
  }
  // __root.tsx reads this value on every load to set the consent default
  window.gtag?.('consent', 'update', {
    analytics_storage: value === 'accepted' ? 'granted' : 'denied',
  })
}

export function PrivacyNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // GA4 always loads (see __root.tsx), so always ask once
    if (!GA4_MEASUREMENT_ID) {
      return
    }

    let consent: string | null = null
    try {
      consent = localStorage.getItem('analytics-consent')
    } catch {
      // storage blocked: show the notice
    }
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    saveConsent('accepted')
    setShow(false)
  }

  const handleDecline = () => {
    saveConsent('declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            Privacy & Cookies
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            We use analytics to improve your experience. By accepting, you agree to our use of cookies for analytics purposes.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              size="sm"
              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              Accept
            </Button>
            <Button
              onClick={handleDecline}
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
            >
              Decline
            </Button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

