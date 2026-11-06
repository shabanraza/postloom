import { createFileRoute } from '@tanstack/react-router'
import { TweetStudioLayout } from './-components'

const pageUrl = 'https://postloom.studio/tweet-card-generator'
const pageTitle = 'Tweet Card Generator – Free, No Watermark | Postloom'
const pageDescription =
    'Turn any tweet into a beautiful image or animated GIF. Paste a tweet URL or write your own, pick a style, and download a PNG or GIF for Instagram, LinkedIn or X. Free, no sign-up, no watermark.'

export const Route = createFileRoute('/tweet-card-generator/')({
    head: () => ({
        meta: [
            { title: pageTitle },
            { name: 'description', content: pageDescription },
            { property: 'og:url', content: pageUrl },
            { property: 'og:title', content: pageTitle },
            { property: 'og:description', content: pageDescription },
            { name: 'twitter:url', content: pageUrl },
            { name: 'twitter:title', content: pageTitle },
            { name: 'twitter:description', content: pageDescription },
        ],
        links: [{ rel: 'canonical', href: pageUrl }],
    }),
    component: TweetStudioPage,
})

function TweetStudioPage() {
    return <TweetStudioLayout />
}
