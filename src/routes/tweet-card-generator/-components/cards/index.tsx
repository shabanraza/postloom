import { useEffect } from 'react'
import { useTweetStudioStore } from '../../-state'
import { TwitterCard } from './TwitterCard'
import { ThreadsCard } from './ThreadsCard'
import { LinkedInCard } from './LinkedInCard'
import { ThreadCard } from './ThreadCard'

export function CardRenderer() {
    const platform = useTweetStudioStore((state) => state.platform)
    const cardType = useTweetStudioStore((state) => state.tweet.cardType)
    const setQuoteTweetEnabled = useTweetStudioStore((state) => state.setQuoteTweetEnabled)

    // Auto-enable quote tweet when card type is 'quote'
    useEffect(() => {
        if (cardType === 'quote') {
            setQuoteTweetEnabled(true)
        } else if (cardType === 'single' || cardType === 'thread') {
            setQuoteTweetEnabled(false)
        }
    }, [cardType, setQuoteTweetEnabled])

    // For Twitter, check if it's a thread
    if (platform === 'twitter' && cardType === 'thread') {
        return <ThreadCard />
    }

    switch (platform) {
        case 'twitter':
            return <TwitterCard />
        case 'threads':
            return <ThreadsCard />
        case 'linkedin':
            return <LinkedInCard />
        default:
            return <TwitterCard />
    }
}

export { TwitterCard, ThreadsCard, LinkedInCard, ThreadCard }

