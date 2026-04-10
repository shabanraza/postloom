// TwitterCard - Refactored from TweetCard for multi-platform support
// This is essentially the original TweetCard with the same styling

import { TweetCard } from '../TweetCard'

// Re-export TweetCard as TwitterCard for backward compatibility
export function TwitterCard() {
    return <TweetCard />
}

