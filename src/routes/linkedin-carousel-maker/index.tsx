import { createFileRoute } from '@tanstack/react-router'
import { CarouselMaker } from '../carousel-maker/-components/CarouselMaker'
import { pageHead } from '@/lib/seo'

const SAMPLE = `5 things I learned closing our first 100 B2B customers

Talk to the user, not just the buyer. The buyer signs, the user renews.

Send a one-page summary after every call. Deals stall when nobody remembers what was agreed.

Price on value, not seats. Our average deal doubled when we stopped counting logins.

Ask for the intro on the call. "Who else should see this?" opened half our pipeline.

Follow for more notes from building a B2B startup.`

export const Route = createFileRoute('/linkedin-carousel-maker/')({
  head: () =>
    pageHead({
      path: '/linkedin-carousel-maker',
      title: 'Free LinkedIn Carousel Maker – Text to PDF Carousel, No Watermark | Postloom',
      description:
        'Make a LinkedIn carousel (PDF document post) from plain text in seconds. Paste your post, pick a style, download one PDF ready to upload. Free, no sign-up, no watermark.',
    }),
  component: () => (
    <CarouselMaker
      title="Free LinkedIn carousel maker"
      description="Write your post as short paragraphs and get a LinkedIn-ready PDF carousel. Each paragraph becomes a 1080×1350 slide with your name and handle. No design tool needed."
      sample={SAMPLE}
      defaultTheme="light"
      primary="pdf"
      steps={[
        'Paste your LinkedIn post or outline. Each paragraph becomes one slide; the first is your hook.',
        'Add your name and handle and choose a paper, charcoal or sage style with an accent color.',
        'Download the PDF, then in LinkedIn choose Start a post → Add a document and upload it.',
      ]}
      faqs={[
        {
          question: 'How do I post a carousel on LinkedIn?',
          answer:
            'LinkedIn carousels are PDF document posts. Start a post, choose “Add a document”, upload the PDF from Postloom and give it a title. LinkedIn shows each page as a swipeable slide.',
        },
        {
          question: 'What size should LinkedIn carousel slides be?',
          answer:
            '1080×1350 (4:5 portrait) takes up the most space in the feed. Postloom exports every slide at that size.',
        },
        {
          question: 'Is there a watermark or slide limit?',
          answer: 'No. It is free with no watermark, no account and no limit on slides or downloads.',
        },
        {
          question: 'How many slides should a LinkedIn carousel have?',
          answer:
            'Most well-performing carousels have 5 to 10 slides: a hook, one idea per slide and a closing call to action.',
        },
      ]}
    />
  ),
})
