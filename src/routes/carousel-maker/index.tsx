import { createFileRoute } from '@tanstack/react-router'
import { CAROUSEL_FAQS, CarouselMaker } from './-components/CarouselMaker'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/carousel-maker/')({
  head: () =>
    pageHead({
      path: '/carousel-maker',
      title: 'Free Carousel Maker for Instagram & LinkedIn – Thread to Carousel | Postloom',
      description:
        'Turn a tweet thread or any text into an Instagram carousel or LinkedIn PDF carousel in seconds. Paste your text, pick a style, download PNG slides or a PDF. Free, no sign-up.',
    }),
  component: () => (
    <CarouselMaker
      title="Free carousel maker for Instagram and LinkedIn"
      description="Paste a tweet thread or any text. Each paragraph becomes a 1080×1350 slide. Download PNG slides for Instagram or one PDF for a LinkedIn carousel post."
      steps={[
        'Paste a tweet thread, newsletter section or list of tips.',
        'Add your name and handle, then pick a paper, charcoal or sage style and an accent color.',
        'Download one PDF to upload as a LinkedIn document post, or PNG slides (in one ZIP) for an Instagram carousel.',
      ]}
      faqs={CAROUSEL_FAQS}
    />
  ),
})
