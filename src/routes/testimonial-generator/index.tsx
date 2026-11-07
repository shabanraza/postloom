import { createFileRoute } from '@tanstack/react-router'
import { TESTIMONIAL_FAQS, TestimonialGenerator } from './-components/TestimonialGenerator'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/testimonial-generator/')({
  head: () =>
    pageHead({
      path: '/testimonial-generator',
      title: 'Free Testimonial Image Generator – Tweet to Testimonial & Wall of Love | Postloom',
      description:
        'Turn tweets and customer quotes into branded testimonial images and a free wall of love embed for your website. Paste tweet links, pick a style, download PNGs. No sign-up, no watermark.',
    }),
  component: () => (
    <TestimonialGenerator
      title="Free testimonial image generator"
      description="Turn tweets and customer quotes into branded testimonial images, plus a wall of love you can embed on your website. Paste tweet links or type quotes, pick a style, download."
      steps={[
        'Paste links to tweets about your product, or type quotes from emails, reviews and calls.',
        'Pick a paper, charcoal or sage style, a size and your brand name and accent color.',
        'Download PNGs for social posts and sales decks, or copy the wall of love code for your website.',
      ]}
      faqs={TESTIMONIAL_FAQS}
    />
  ),
})
