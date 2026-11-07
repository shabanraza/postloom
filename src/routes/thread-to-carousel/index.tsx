import { createFileRoute } from '@tanstack/react-router'
import { CarouselMaker } from '../carousel-maker/-components/CarouselMaker'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/thread-to-carousel/')({
  head: () =>
    pageHead({
      path: '/thread-to-carousel',
      title: 'Twitter Thread to Carousel – Turn X Threads into LinkedIn & Instagram Carousels | Postloom',
      description:
        'Repurpose an X (Twitter) thread into a LinkedIn PDF carousel or Instagram slides. Paste the thread, thread numbers are removed automatically, download in seconds. Free, no sign-up.',
    }),
  component: () => (
    <CarouselMaker
      title="Turn a Twitter thread into a carousel"
      description="Your best thread already did well on X. Paste it here and each tweet becomes a slide, with “1/” style numbering removed, ready to post on LinkedIn or Instagram."
      steps={[
        'Copy your thread from X and paste it. Each tweet (or blank-line-separated paragraph) becomes a slide.',
        'Thread numbers like “1/” and “2/5” are stripped automatically. Long tweets split into extra slides.',
        'Download one PDF for LinkedIn or PNG slides (in one ZIP) for Instagram.',
      ]}
      faqs={[
        {
          question: 'Why repurpose a thread as a carousel?',
          answer:
            'A thread that worked on X is already proven content. As a carousel it reaches LinkedIn and Instagram audiences, where swipeable posts get more time on screen.',
        },
        {
          question: 'Do I need to remove the thread numbering?',
          answer: 'No. Postloom removes “1/”, “2/” and “3/10” style numbering for you.',
        },
        {
          question: 'Can I import a thread by URL?',
          answer:
            'Not yet. Paste the thread text; it takes a few seconds and lets you trim tweets before they become slides.',
        },
        {
          question: 'Is it free?',
          answer: 'Yes. No sign-up, no watermark and no limit on downloads.',
        },
      ]}
    />
  ),
})
