import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { fetchTweetFromUrl } from '../../-utils/fetch-tweet'
import { trackTweetImport } from '@/lib/analytics'

export function ImportUrlSection() {
    const [importUrl, setImportUrl] = useState('')
    const [isImporting, setIsImporting] = useState(false)
    const [importError, setImportError] = useState<string | null>(null)

    const { setTweetFromFetched, platform } = useTweetStudioStore()

    const handleImport = async () => {
        if (!importUrl.trim()) {
            setImportError('Please enter a URL')
            return
        }

        setIsImporting(true)
        setImportError(null)

        try {
            if (platform !== 'twitter') {
                setImportError(`Import only supported for Twitter/X`)
                setIsImporting(false)
                return
            }

            const tweet = await fetchTweetFromUrl(importUrl)

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

            setImportUrl('')
            setImportError(null)
            trackTweetImport(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch'
            setImportError(errorMessage)
            trackTweetImport(false, errorMessage)
        } finally {
            setIsImporting(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleImport()
        }
    }

    const isDisabled = platform !== 'twitter'

    return (
        <div className="space-y-2">
            <Label className="text-xs text-slate-500">Import from URL</Label>
            <div className="flex gap-2">
                <Input
                    type="url"
                    placeholder={isDisabled ? "Coming soon..." : "Paste tweet URL..."}
                    value={importUrl}
                    onChange={(e) => {
                        setImportUrl(e.target.value)
                        setImportError(null)
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isImporting || isDisabled}
                    className="h-8 text-sm bg-transparent border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                />
                <Button
                    size="sm"
                    onClick={handleImport}
                    disabled={isImporting || !importUrl.trim() || isDisabled}
                    className="h-8 px-4"
                >
                    {isImporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        'Import'
                    )}
                </Button>
            </div>
            {importError && (
                <p className="text-xs text-red-500">{importError}</p>
            )}
        </div>
    )
}
