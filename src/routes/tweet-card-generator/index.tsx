import { createFileRoute } from '@tanstack/react-router'
import { TweetStudioLayout } from './-components'

export const Route = createFileRoute('/tweet-card-generator/')({
    component: TweetStudioPage,
})

function TweetStudioPage() {
    return <TweetStudioLayout />
}
