import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/layout/Container'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { CookieSettingsButton } from '@/components/PrivacyNotice'
import { pageHead } from '@/lib/seo'

const CONTACT_EMAIL = 'msvoide@gmail.com'
const UPDATED = '7 November 2026'

export const Route = createFileRoute('/privacy/')({
  head: () =>
    pageHead({
      path: '/privacy',
      title: 'Privacy and cookie policy | Postloom',
      description:
        'What Postloom collects, which cookies it uses, how long data is kept and how to opt out. No accounts, no ads, and what you create stays in your browser.',
    }),
  component: PrivacyPage,
})

const COOKIES = [
  { name: '_ga', provider: 'Google Analytics', purpose: 'Tells visits from different browsers apart', expiry: '2 years' },
  { name: '_ga_<id>', provider: 'Google Analytics', purpose: 'Keeps track of the current visit', expiry: '2 years' },
  { name: '_clck', provider: 'Microsoft Clarity', purpose: 'Tells visits from different browsers apart', expiry: '1 year' },
  { name: '_clsk', provider: 'Microsoft Clarity', purpose: 'Joins page views into one recording', expiry: '1 day' },
  { name: 'CLID, MUID', provider: 'Microsoft Clarity (clarity.ms)', purpose: 'Recognises the browser across sites that use Clarity', expiry: '1 year' },
]

const STORAGE = [
  { name: 'theme', purpose: 'Light or dark mode' },
  { name: 'tweet-studio-storage', purpose: 'Your editor design and export settings' },
  { name: 'postloom-onboarding-complete', purpose: 'Whether you have seen the editor intro' },
  { name: 'analytics-consent', purpose: 'Your cookie choice' },
]

function PrivacyPage() {
  return (
    <MarketingLayout>
      <Container className="max-w-3xl py-12 sm:py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Privacy and cookie policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {UPDATED}</p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_strong]:text-foreground">
          <section>
            <h2>The short version</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>There are no accounts, no ads, and we never sell or share your data for advertising.</li>
              <li>What you write and design is processed in your browser. Images are made on your device.</li>
              <li>We use Google Analytics and Microsoft Clarity to learn which tools people use and to fix problems.</li>
              <li>
                In the EU, EEA, UK and Switzerland they only run if you accept. Elsewhere you can opt out at any
                time, and we treat a Global Privacy Control signal from your browser as an opt-out.
              </li>
            </ul>
          </section>

          <section>
            <h2>Who we are</h2>
            <p>
              Postloom (postloom.studio) is run by an individual developer. For anything about your data,
              email <a className="text-foreground underline underline-offset-2" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2>What you create</h2>
            <p>
              Text, names, images and settings you enter in our tools stay in your browser, and exported images
              and PDFs are generated on your device. When you import a post by its link, our server fetches that
              public post from X and sends it back to your browser. We don't store it or keep logs of it.
            </p>
            <p className="mt-3">Your browser's local storage keeps a few settings so the tools remember them. They are never sent to us:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {STORAGE.map((item) => (
                <li key={item.name}>
                  <code className="text-foreground">{item.name}</code>: {item.purpose}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Analytics</h2>
            <p>
              <strong>Google Analytics</strong> (Google) records the pages you visit, which buttons you click,
              when you export an image, the site that sent you, your browser and device, and your approximate
              location (country and city). Google Analytics does not log or store IP addresses. Google signals and
              advertising features are turned off. We keep this data for 14 months.
            </p>
            <p className="mt-3">
              <strong>Microsoft Clarity</strong> (Microsoft) records how pages are used, such as clicks, scrolling
              and mouse movement, as session recordings and heatmaps. The tool areas, where you type and design,
              are hidden from recordings. Microsoft keeps recordings for 30 days and heatmap data for up to 13 months.
            </p>
            <p className="mt-3">
              Both run only on postloom.studio and only after the consent rules above are met. Google and Microsoft
              process this data for us and may transfer it outside your country; both take part in the EU-U.S.
              Data Privacy Framework.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>We set no cookies of our own. These are set by the analytics tools, only when analytics are allowed:</p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Cookie</th>
                    <th className="px-3 py-2 font-medium">Set by</th>
                    <th className="px-3 py-2 font-medium">Purpose</th>
                    <th className="px-3 py-2 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name} className="border-t border-border">
                      <td className="px-3 py-2 font-mono text-xs text-foreground">{c.name}</td>
                      <td className="px-3 py-2">{c.provider}</td>
                      <td className="px-3 py-2">{c.purpose}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{c.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Change your choice at any time:{' '}
              <CookieSettingsButton className="text-foreground underline underline-offset-2" />. Rejecting stops
              analytics and deletes their cookies on this site.
            </p>
          </section>

          <section>
            <h2>Why we're allowed to</h2>
            <p>
              In the EU, EEA, UK and Switzerland we rely on your consent, which you can withdraw at any time.
              Elsewhere we rely on our legitimate interest in understanding how the site is used, and you can
              object by opting out.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              Depending on where you live (for example under the GDPR, UK GDPR, California's CCPA/CPRA, Brazil's
              LGPD or India's DPDP Act), you can ask to access, correct or delete data about you, object to or
              restrict its use, and withdraw consent. We don't sell or share personal information as those laws
              define it. Analytics data isn't tied to your name, so the quickest way to stop collection is to
              reject cookies. For anything else, email{' '}
              <a className="text-foreground underline underline-offset-2" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{' '}
              and we'll reply within 30 days. You can also complain to your local data protection authority.
            </p>
          </section>

          <section>
            <h2>Children</h2>
            <p>Postloom isn't aimed at children under 16, and we don't knowingly collect their data.</p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>If this policy changes, we'll update it here and change the date at the top.</p>
          </section>
        </div>
      </Container>
    </MarketingLayout>
  )
}
