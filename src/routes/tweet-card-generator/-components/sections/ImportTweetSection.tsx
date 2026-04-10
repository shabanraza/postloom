import { useState } from 'react'
import { Link2, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTweetStudioStore } from '../../-state'
import { fetchTweetFromUrl } from '../../-utils/fetch-tweet'

export function ImportTweetSection() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const setTweetFromFetched = useTweetStudioStore((state) => state.setTweetFromFetched)

    const handleImport = async () => {
        if (!url.trim()) {
            setError('Please enter a tweet URL')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const tweet = await fetchTweetFromUrl(url)

            setTweetFromFetched({
                text: tweet.text,
                displayName: tweet.user.name,
                username: tweet.user.screen_name,
                avatarUrl: tweet.user.profile_image_url_https,
                verified: tweet.user.verified,
                likes: tweet.favorite_count,
                reposts: tweet.retweet_count,
                replies: tweet.reply_count,
                views: tweet.views_count,
                timestamp: new Date(tweet.created_at),
            })

            setUrl('')
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tweet')
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleImport()
        }
    }

    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Import Tweet</p>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        type="url"
                        placeholder="Paste Twitter/X URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
                    />
                </div>
                <Button
                    type="button"
                    size="sm"
                    onClick={handleImport}
                    disabled={isLoading || !url.trim()}
                    className="h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg"
                >
                    {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        'Import'
                    )}
                </Button>
            </div>

            {error && (
                <div className="flex items-start gap-1.5 text-[10px] text-red-500">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
