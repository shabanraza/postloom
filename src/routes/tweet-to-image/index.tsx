import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { LiveDemo } from '../-home/LiveDemo'
import { ToolPage } from '@/components/layout/ToolPage'
import { Button } from '@/components/ui/button'
import { trackCtaClick } from '@/lib/analytics'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/tweet-to-image/')({
  head: () =>
    pageHead({
      path: '/tweet-to-image',
      title: 'Tweet to Image Converter – Free, No Watermark | Postloom',
      description:
        'Convert a tweet into a clean, shareable image in seconds. Type or paste the text, pick a style and download a PNG for Instagram, LinkedIn or Threads. Free, no sign-up, no watermark.',
    }),
  component: TweetToImagePage,
})

function TweetToImagePage() {
  return (
    <ToolPage
      title="Tweet to image converter"
      description="Screenshots look cropped and cluttered. Type or paste a tweet below and download a clean card image you can post on Instagram, LinkedIn or Threads."
      badges={['Free', 'No sign-up', 'No watermark']}
      steps={[
        'Type your tweet or paste its text, then set the name and handle in the full editor.',
        'Pick a paper, charcoal, sage or sand style. The card updates as you type.',
        'Download the PNG, or open the full editor for tweet import by URL, threads, polls, sizes and animated GIFs.',
      ]}
      faqs={[
        {
          question: 'How do I turn a tweet into an image?',
          answer:
            'Paste the tweet text into the box above and press Download PNG. To import a tweet straight from its URL with the real name, avatar and metrics, use the full Tweet Card Generator.',
        },
        {
          question: 'Is it better than a screenshot?',
          answer:
            'Yes. A screenshot includes app chrome, cropping and low resolution. Postloom renders a clean, high-resolution card on a background sized for each platform.',
        },
        {
          question: 'Which sizes can I download?',
          answer:
            'The quick converter exports a landscape PNG. The full editor adds Instagram post and story, LinkedIn, X and custom sizes, plus animated GIF.',
        },
        {
          question: 'Is it free?',
          answer: 'Yes. No account, no watermark and no download limit.',
        },
      ]}
    >
      <div className="mx-auto max-w-2xl">
        <LiveDemo source="tweet_to_image" />
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link
              to="/tweet-card-generator"
              onClick={() => trackCtaClick('open_editor', 'tweet_to_image')}
            >
              Import a tweet by URL in the full editor
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </ToolPage>
  )
}
