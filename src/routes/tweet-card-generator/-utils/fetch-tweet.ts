import { createServerFn } from '@tanstack/react-start'

export interface FetchedTweet {
    id: string
    text: string
    user: {
        name: string
        screen_name: string
        profile_image_url_https: string
        verified: boolean
    }
    created_at: string
    favorite_count: number
    retweet_count: number
    reply_count: number
    views_count?: number
}

// Extract tweet ID from URL
function extractTweetId(url: string): string | null {
    const patterns = [
        /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
        /(?:twitter\.com|x\.com)\/\w+\/statuses\/(\d+)/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    if (/^\d+$/.test(url.trim())) return url.trim()
    return null
}

// Server function to fetch tweet (runs on server, bypasses CORS)
export const fetchTweetServer = createServerFn({ method: 'POST' })
    .inputValidator((url: string) => url)
    .handler(async ({ data: url }): Promise<FetchedTweet> => {
        const tweetId = extractTweetId(url)

        if (!tweetId) {
            throw new Error('Invalid tweet URL. Please enter a valid Twitter/X post URL.')
        }

        const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&features=tfw_timeline_list:;tfw_follower_count_sunset:true;tfw_tweet_edit_backend:on;tfw_refsrc_session:on;tfw_fosnr_soft_interventions_enabled:on;tfw_show_biz_verified_badge:on;tfw_duplicate_scribes_to_settings:on;tfw_use_profile_image_shape_enabled:on;tfw_show_blue_verified_badge:on;tfw_legacy_timeline_sunset:true;tfw_show_gov_verified_badge:on;tfw_show_business_affiliate_badge:on;tfw_tweet_edit_frontend:on&token=0`

        const response = await fetch(syndicationUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Tweet not found. It may have been deleted or the account is private.')
            }
            throw new Error(`Failed to fetch tweet: ${response.status}`)
        }

        const data = await response.json()

        // Log the full response for debugging
        console.log('[Tweet API] Response:', JSON.stringify(data, null, 2))

        // Build safe result with fallbacks
        const result: FetchedTweet = {
            id: data?.id_str || data?.rest_id || tweetId,
            text: data?.text || data?.full_text || '',
            user: {
                name: data?.user?.name || 'Unknown User',
                screen_name: data?.user?.screen_name || 'unknown',
                profile_image_url_https: (data?.user?.profile_image_url_https || '').replace('_normal', '_400x400'),
                verified: data?.user?.verified || data?.user?.is_blue_verified || false,
            },
            created_at: data?.created_at || new Date().toISOString(),
            favorite_count: data?.favorite_count || 0,
            retweet_count: data?.retweet_count || 0,
            reply_count: data?.reply_count || data?.conversation_count || 0,
            views_count: data?.views?.count ? parseInt(data.views.count) : undefined,
        }

        console.log('[Tweet API] Parsed result:', result)

        return result
    })

// Client wrapper function
export async function fetchTweetFromUrl(url: string): Promise<FetchedTweet> {
    const result = await fetchTweetServer({ data: url })
    console.log('[Client] Received tweet data:', result)
    return result
}
