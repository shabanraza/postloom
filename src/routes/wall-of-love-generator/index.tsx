import { createFileRoute } from '@tanstack/react-router'
import { TestimonialGenerator } from '../testimonial-generator/-components/TestimonialGenerator'
import { pageHead } from '@/lib/seo'

export const Route = createFileRoute('/wall-of-love-generator/')({
  head: () =>
    pageHead({
      path: '/wall-of-love-generator',
      title: 'Free Wall of Love Generator – Embed Testimonials on Your Website | Postloom',
      description:
        'Build a wall of love from tweets and customer quotes and embed it on any website with plain HTML. No script, no account, no monthly fee. Free testimonial wall generator.',
    }),
  component: () => (
    <TestimonialGenerator
      title="Free wall of love generator"
      description="Collect your best tweets and customer quotes into a wall of love, then paste one block of HTML into your site. No widget script to load and no subscription to keep it online."
      defaultTab="wall"
      steps={[
        'Paste links to tweets that mention your product, or add quotes from emails and reviews.',
        'Set a heading, style and accent color. The preview shows exactly how the wall will look.',
        'Copy the embed code and paste it into an HTML or embed block in Webflow, Framer, WordPress or your own site.',
      ]}
      faqs={[
        {
          question: 'What is a wall of love?',
          answer:
            'A section of your website that shows what customers say about you, usually a grid of tweets and quotes. It builds trust right where visitors decide to sign up.',
        },
        {
          question: 'Does the embed need a script or an account?',
          answer:
            'No. Postloom gives you plain HTML with inline styles. It loads instantly, works in any site builder and keeps working without a subscription.',
        },
        {
          question: 'How do I update the wall later?',
          answer: 'Add or edit quotes here, copy the new code and replace the old block on your site.',
        },
        {
          question: 'Can I also make testimonial images?',
          answer:
            'Yes. Switch to the Images tab to download each quote as a branded PNG for social posts or sales decks.',
        },
      ]}
    />
  ),
})
