import { createFileRoute } from '@tanstack/react-router'
import { CarouselMaker } from '../carousel-maker/-components/CarouselMaker'
import { pageHead } from '@/lib/seo'

const SAMPLE = `How to plan a week of content in 30 minutes

Pick one theme for the week. Every post answers one question about it.

Write 5 hooks before you write anything else. Keep the best 3.

Batch the visuals in one sitting. Same style, same colors.

Schedule them all, then stop thinking about it.

Save this for your next planning day.`

export const Route = createFileRoute('/instagram-carousel-maker/')({
  head: () =>
    pageHead({
      path: '/instagram-carousel-maker',
      title: 'Free Instagram Carousel Maker – Text to 1080×1350 Slides | Postloom',
      description:
        'Turn text into Instagram carousel slides in seconds. Paste your tips or a thread, pick a style, download 1080×1350 PNG slides ready to post. Free, no sign-up, no watermark.',
    }),
  component: () => (
    <CarouselMaker
      title="Free Instagram carousel maker"
      description="Paste tips, a list or a thread and get Instagram carousel slides at 1080×1350, the 4:5 size that fills the feed. Download every slide as a PNG and post them in order."
      sample={SAMPLE}
      defaultTheme="sage"
      primary="png"
      steps={[
        'Paste your caption, tips or list. A blank line starts a new slide.',
        'Add your handle and pick a paper, charcoal or sage style with an accent color.',
        'Download the PNGs and select them in order when you create a new Instagram post.',
      ]}
      faqs={[
        {
          question: 'What is the best size for an Instagram carousel?',
          answer:
            '1080×1350 pixels (4:5 portrait). It shows larger in the feed than square posts, and every slide in a carousel must share one size.',
        },
        {
          question: 'How many slides can an Instagram carousel have?',
          answer: 'Instagram allows up to 20 images in one carousel post. Postloom has no slide limit.',
        },
        {
          question: 'Do the slides have a watermark?',
          answer: 'No. Downloads are free, with no watermark and no sign-up.',
        },
        {
          question: 'Can I also post the same carousel on LinkedIn?',
          answer: 'Yes. Download the PDF version and upload it as a LinkedIn document post.',
        },
      ]}
    />
  ),
})
