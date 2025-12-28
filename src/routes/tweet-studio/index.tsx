import { createFileRoute } from '@tanstack/react-router'
import { TweetStudioLayout } from './-components'

export const Route = createFileRoute('/tweet-studio/')({
    component: TweetStudioPage,
})

function TweetStudioPage() {
    return <TweetStudioLayout />
}
