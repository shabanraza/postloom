import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
    Tweet,
    TweetCardTheme,
    DesignSettings,
    AnimationSettings,
    ExportSettings,
    ExportPreset,
    Platform,
    ProfileData,
    TwitterMetrics,
    ThreadsMetrics,
    LinkedInMetrics,
    PollData,
    PollOption,
    VerificationBadgeType,
    CardType,
    ThreadItem,
    QuotedTweet,
    BrandKit,
    BrandColor,
    BrandFont,
} from '../-types'
import {
    EXPORT_SIZES,
    ANIMATION_DEFAULTS,
    PADDING_RANGE,
    QUICK_PRESETS,
    TEMPLATES,
} from '../-constants'

interface TweetStudioState {
    // Platform Selection
    platform: Platform

    // Tweet Data (legacy, kept for backward compatibility)
    tweet: Tweet

    // Platform-specific profile data
    profile: ProfileData

    // Platform-specific metrics
    twitterMetrics: TwitterMetrics
    threadsMetrics: ThreadsMetrics
    linkedinMetrics: LinkedInMetrics

    // Design Settings
    design: DesignSettings

    // Animation Settings
    animation: AnimationSettings

    // Export Settings
    export: ExportSettings

    // UI State
    isExporting: boolean
    exportProgress: number

    // History for undo/redo
    history: Array<{ tweet: Tweet; design: DesignSettings }>
    historyIndex: number
    studioMode: 'static' | 'gif'

    // Brand Kit
    brandKits: BrandKit[]
    activeBrandKitId: string | null

    // Actions - Platform
    setPlatform: (platform: Platform) => void

    // Actions - Tweet
    setDisplayName: (name: string) => void
    setUsername: (username: string) => void
    setAvatarUrl: (url: string | undefined) => void
    setVerified: (verified: boolean) => void
    setBadgeType: (type: VerificationBadgeType) => void
    setTweetText: (text: string) => void
    setReplyTo: (username: string | undefined) => void
    setMediaUrl: (url: string | undefined) => void
    setShowTimestamp: (show: boolean) => void
    setTimestamp: (date: Date) => void
    setTweetTheme: (theme: TweetCardTheme) => void

    // Actions - LinkedIn specific
    setHeadline: (headline: string) => void
    setCompany: (company: string) => void

    // Actions - Metrics (Twitter)
    setShowMetrics: (show: boolean) => void
    setReplies: (count: number) => void
    setReposts: (count: number) => void
    setLikes: (count: number) => void
    setBookmarks: (count: number) => void
    setViews: (count: number) => void

    // Actions - Metrics (LinkedIn)
    setReactions: (count: number) => void
    setComments: (count: number) => void

    // Actions - Design
    setTemplateId: (id: string) => void
    setBackgroundType: (type: DesignSettings['backgroundType']) => void
    setBackgroundColor: (color: string) => void
    setGradient: (gradient: DesignSettings['gradient']) => void
    setPatternType: (pattern: DesignSettings['patternType']) => void
    setBackgroundImageUrl: (url: string | undefined) => void
    setPadding: (padding: number) => void
    setScale: (scale: number) => void
    setShadow: (shadow: DesignSettings['shadow']) => void
    setShadowIntensity: (intensity: number) => void
    setCardScale: (scale: number) => void
    setFontSizeMultiplier: (multiplier: number) => void

    // Actions - Animation
    setAnimationType: (type: AnimationSettings['type']) => void
    setAnimationEnabled: (enabled: boolean) => void
    setAnimationSpeed: (speed: number) => void
    setAnimationDelay: (delay: number) => void
    setAnimationLoop: (loop: boolean) => void
    setShowCursor: (show: boolean) => void

    // Actions - Export
    setExportPreset: (preset: ExportPreset) => void
    setExportFormat: (format: 'png' | 'gif') => void
    setCustomSize: (width: number, height: number) => void
    setIsExporting: (exporting: boolean) => void
    setExportProgress: (progress: number) => void

    // Actions - Quick Preset
    applyQuickPreset: (presetId: string) => void

    // Actions - History
    undo: () => void
    redo: () => void
    saveToHistory: () => void

    // Actions - Reset
    reset: () => void
    setStudioMode: (mode: 'static' | 'gif') => void

    // Actions - Import from URL
    setTweetFromFetched: (data: {
        text: string
        displayName: string
        username: string
        avatarUrl: string
        verified: boolean
        likes: number
        reposts: number
        replies: number
        views?: number
        timestamp?: Date
    }) => void

    // Actions - Poll
    setPollEnabled: (enabled: boolean) => void
    setPollOptions: (options: PollOption[]) => void
    updatePollOption: (id: string, text: string) => void
    updatePollVotes: (id: string, votes: number) => void
    addPollOption: () => void
    removePollOption: (id: string) => void
    setPollDuration: (duration: string) => void
    setPollShowResults: (show: boolean) => void

    // Actions - Card Type
    setCardType: (type: CardType) => void

    // Actions - Thread
    addThreadItem: () => void
    removeThreadItem: (id: string) => void
    updateThreadItem: (id: string, text: string) => void
    updateThreadItemMedia: (id: string, mediaUrl: string | undefined) => void
    reorderThreadItems: (items: ThreadItem[]) => void
    setThreadConnector: (show: boolean) => void

    // Actions - Quote Tweet
    setQuoteTweetEnabled: (enabled: boolean) => void
    setQuoteTweetProfile: (profile: Partial<QuotedTweet['profile']>) => void
    setQuoteTweetText: (text: string) => void
    setQuoteTweetMedia: (mediaUrl: string | undefined) => void

    // Actions - Brand Kit
    createBrandKit: (name: string) => void
    deleteBrandKit: (id: string) => void
    setActiveBrandKit: (id: string | null) => void
    addBrandColor: (kitId: string, color: BrandColor) => void
    removeBrandColor: (kitId: string, colorId: string) => void
    updateBrandColor: (kitId: string, colorId: string, color: Partial<BrandColor>) => void
    addBrandFont: (kitId: string, font: BrandFont) => void
    removeBrandFont: (kitId: string, fontId: string) => void
    applyBrandColor: (color: string) => void
    applyBrandFont: (fontFamily: string, fontWeight: number) => void

    // Getters - Get current platform's metrics
    getCurrentMetrics: () => TwitterMetrics | ThreadsMetrics | LinkedInMetrics
}

// Initial profile data (shared across platforms)
const initialProfile: ProfileData = {
    displayName: 'John Doe',
    username: 'johndoe',
    avatarUrl: undefined,
    verified: true,
    badgeType: 'blue',
    headline: 'Software Engineer',
    company: 'Tech Company',
}

// Initial metrics for each platform
const initialTwitterMetrics: TwitterMetrics = {
    showMetrics: true,
    replies: 12,
    reposts: 45,
    likes: 234,
    bookmarks: 8,
    views: 1250,
}

const initialThreadsMetrics: ThreadsMetrics = {
    showMetrics: true,
    likes: 234,
    replies: 12,
    reposts: 45,
}

const initialLinkedInMetrics: LinkedInMetrics = {
    showMetrics: true,
    reactions: 234,
    comments: 12,
    reposts: 45,
}

const initialPoll: PollData = {
    enabled: false,
    options: [
        { id: '1', text: 'Option 1', votes: 45 },
        { id: '2', text: 'Option 2', votes: 30 },
        { id: '3', text: 'Option 3', votes: 15 },
        { id: '4', text: 'Option 4', votes: 10 },
    ],
    totalVotes: 100,
    duration: '1 day left',
    showResults: true,
}

const initialThread: ThreadItem[] = [
    { id: '1', text: 'This is the first tweet in the thread! 🧵', mediaUrl: undefined },
    { id: '2', text: 'Here\'s some more context and details...', mediaUrl: undefined },
    { id: '3', text: 'And finally, the conclusion! 🎉', mediaUrl: undefined },
]

const initialQuotedTweet: QuotedTweet = {
    enabled: false,
    profile: {
        displayName: 'Quoted User',
        username: 'quoteduser',
        avatarUrl: undefined,
        verified: true,
        badgeType: 'blue',
    },
    text: 'This is the original tweet that\'s being quoted.',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    mediaUrl: undefined,
}

const initialTweet: Tweet = {
    profile: {
        displayName: 'John Doe',
        username: 'johndoe',
        avatarUrl: undefined,
        verified: true,
        badgeType: 'blue',
    },
    content: {
        text: 'Ah, the new feature is finally here! 🚀 #LaunchDay',
        replyTo: undefined,
        showTimestamp: true,
        timestamp: new Date(),
        mediaUrl: undefined,
        poll: initialPoll,
    },
    metrics: initialTwitterMetrics,
    theme: 'dark',
    cardType: 'single',
    thread: {
        items: initialThread,
        showConnector: true,
    },
    quotedTweet: initialQuotedTweet,
}

const initialDesign: DesignSettings = {
    templateId: 'minimal',
    backgroundType: 'image',
    backgroundColor: '#0f172a',
    gradient: {
        colors: ['#3b82f6', '#8b5cf6'],
        direction: 'to-br',
    },
    patternType: undefined,
    // Default starry night background
    backgroundImageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    padding: PADDING_RANGE.default,
    scale: 1,
    shadow: 'soft',
    shadowIntensity: 50, // Default shadow intensity (0-100)
    // Card-level styling defaults (from minimal template)
    cardScale: 1,
    borderRadius: 16,
    fontWeight: 400,
    fontFamily: 'system-ui, sans-serif',
    fontSizeMultiplier: 1.0, // Default font size multiplier
}

const initialAnimation: AnimationSettings = {
    type: 'none',
    enabled: false,
    speed: ANIMATION_DEFAULTS.speed,
    delay: ANIMATION_DEFAULTS.delay,
    loop: ANIMATION_DEFAULTS.loop,
    showCursor: ANIMATION_DEFAULTS.showCursor,
    fps: ANIMATION_DEFAULTS.fps,
}

const initialExport: ExportSettings = {
    preset: 'instagram',
    width: EXPORT_SIZES.instagram.width,
    height: EXPORT_SIZES.instagram.height,
    format: 'png',
    quality: 85,
}

const initialBrandKit: BrandKit = {
    id: 'default',
    name: 'My Brand',
    colors: [
        { id: '1', name: 'Primary', color: '#3b82f6' },
        { id: '2', name: 'Secondary', color: '#8b5cf6' },
        { id: '3', name: 'Accent', color: '#ec4899' },
    ],
    fonts: [
        { id: '1', name: 'Heading', fontFamily: 'system-ui, sans-serif', fontWeight: 700 },
        { id: '2', name: 'Body', fontFamily: 'system-ui, sans-serif', fontWeight: 400 },
    ],
    logoUrl: undefined,
    createdAt: new Date(),
}

export const useTweetStudioStore = create<TweetStudioState>()(
    persist(
        (set, get) => ({
            // Initial State
            platform: 'twitter' as Platform,
            tweet: initialTweet,
            profile: initialProfile,
            twitterMetrics: initialTwitterMetrics,
            threadsMetrics: initialThreadsMetrics,
            linkedinMetrics: initialLinkedInMetrics,
            design: initialDesign,
            animation: initialAnimation,
            export: initialExport,
            isExporting: false,
            exportProgress: 0,
            history: [],
            historyIndex: -1,
            studioMode: 'static',

            // Brand Kit
            brandKits: [initialBrandKit],
            activeBrandKitId: null,

            // Platform Action
            setPlatform: (platform) => set({ platform }),

            setStudioMode: (mode) => {
                if (mode === 'gif') {
                    // Auto-enable typewriter animation for GIF mode
                    set((state) => ({
                        studioMode: mode,
                        animation: {
                            ...state.animation,
                            type: 'typewriter',
                            enabled: true,
                        },
                    }))
                } else {
                    // Disable animation for static mode
                    set((state) => ({
                        studioMode: mode,
                        animation: {
                            ...state.animation,
                            type: 'none',
                            enabled: false,
                        },
                    }))
                }
            },

            // Get current platform's metrics
            getCurrentMetrics: () => {
                const state = get()
                switch (state.platform) {
                    case 'twitter':
                        return state.twitterMetrics
                    case 'threads':
                        return state.threadsMetrics
                    case 'linkedin':
                        return state.linkedinMetrics
                    default:
                        return state.twitterMetrics
                }
            },

            // Brand Kit Actions
            createBrandKit: (name) =>
                set((state) => ({
                    brandKits: [
                        ...state.brandKits,
                        {
                            id: String(Date.now()),
                            name,
                            colors: [],
                            fonts: [],
                            logoUrl: undefined,
                            createdAt: new Date(),
                        },
                    ],
                })),

            deleteBrandKit: (id) =>
                set((state) => ({
                    brandKits: state.brandKits.filter((kit) => kit.id !== id),
                    activeBrandKitId: state.activeBrandKitId === id ? null : state.activeBrandKitId,
                })),

            setActiveBrandKit: (id) => set({ activeBrandKitId: id }),

            addBrandColor: (kitId, color) =>
                set((state) => ({
                    brandKits: state.brandKits.map((kit) =>
                        kit.id === kitId
                            ? { ...kit, colors: [...kit.colors, color] }
                            : kit
                    ),
                })),

            removeBrandColor: (kitId, colorId) =>
                set((state) => ({
                    brandKits: state.brandKits.map((kit) =>
                        kit.id === kitId
                            ? { ...kit, colors: kit.colors.filter((c) => c.id !== colorId) }
                            : kit
                    ),
                })),

            updateBrandColor: (kitId, colorId, colorUpdate) =>
                set((state) => ({
                    brandKits: state.brandKits.map((kit) =>
                        kit.id === kitId
                            ? {
                                ...kit,
                                colors: kit.colors.map((c) =>
                                    c.id === colorId ? { ...c, ...colorUpdate } : c
                                ),
                            }
                            : kit
                    ),
                })),

            addBrandFont: (kitId, font) =>
                set((state) => ({
                    brandKits: state.brandKits.map((kit) =>
                        kit.id === kitId
                            ? { ...kit, fonts: [...kit.fonts, font] }
                            : kit
                    ),
                })),

            removeBrandFont: (kitId, fontId) =>
                set((state) => ({
                    brandKits: state.brandKits.map((kit) =>
                        kit.id === kitId
                            ? { ...kit, fonts: kit.fonts.filter((f) => f.id !== fontId) }
                            : kit
                    ),
                })),

            applyBrandColor: (color) =>
                set((state) => ({
                    design: { ...state.design, backgroundColor: color },
                })),

            applyBrandFont: (fontFamily, fontWeight) =>
                set((state) => ({
                    design: { ...state.design, fontFamily, fontWeight },
                })),

            // Import from URL - populate all tweet data
            setTweetFromFetched: (data) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: {
                            ...state.tweet.profile,
                            displayName: data.displayName,
                            username: data.username,
                            avatarUrl: data.avatarUrl,
                            verified: data.verified,
                        },
                        content: {
                            ...state.tweet.content,
                            text: data.text,
                            timestamp: data.timestamp || new Date(),
                        },
                        metrics: {
                            ...state.tweet.metrics,
                            likes: data.likes,
                            reposts: data.reposts,
                            replies: data.replies,
                            views: data.views || 0,
                            showMetrics: true,
                        },
                    },
                })),

            // Tweet Actions
            setDisplayName: (name) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, displayName: name },
                    },
                    profile: { ...state.profile, displayName: name },
                })),

            setUsername: (username) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, username: username.replace('@', '') },
                    },
                    profile: { ...state.profile, username: username.replace('@', '') },
                })),

            setAvatarUrl: (url) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, avatarUrl: url },
                    },
                    profile: { ...state.profile, avatarUrl: url },
                })),

            setVerified: (verified) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, verified },
                    },
                    profile: { ...state.profile, verified },
                })),

            setBadgeType: (type) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, badgeType: type, verified: type !== 'none' },
                    },
                    profile: { ...state.profile, badgeType: type, verified: type !== 'none' },
                })),

            // LinkedIn-specific profile actions
            setHeadline: (headline) =>
                set((state) => ({
                    profile: { ...state.profile, headline },
                })),

            setCompany: (company) =>
                set((state) => ({
                    profile: { ...state.profile, company },
                })),

            setTweetText: (text) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: { ...state.tweet.content, text },
                    },
                })),

            setReplyTo: (username) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: { ...state.tweet.content, replyTo: username?.replace('@', '') },
                    },
                })),

            setMediaUrl: (url) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: { ...state.tweet.content, mediaUrl: url },
                    },
                })),

            setShowTimestamp: (show) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: { ...state.tweet.content, showTimestamp: show },
                    },
                })),

            setTimestamp: (date) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: { ...state.tweet.content, timestamp: date },
                    },
                })),

            // Poll Actions
            setPollEnabled: (enabled) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: {
                            ...state.tweet.content,
                            poll: state.tweet.content.poll
                                ? { ...state.tweet.content.poll, enabled }
                                : {
                                    enabled,
                                    options: [
                                        { id: '1', text: 'Option 1', votes: 0 },
                                        { id: '2', text: 'Option 2', votes: 0 },
                                    ],
                                    totalVotes: 0,
                                    duration: '1 day left',
                                    showResults: false,
                                },
                        },
                    },
                })),

            setPollOptions: (options) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: {
                            ...state.tweet.content,
                            poll: state.tweet.content.poll
                                ? {
                                    ...state.tweet.content.poll,
                                    options,
                                    totalVotes: options.reduce((sum, opt) => sum + opt.votes, 0),
                                }
                                : undefined,
                        },
                    },
                })),

            updatePollOption: (id, text) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: {
                            ...state.tweet.content,
                            poll: state.tweet.content.poll
                                ? {
                                    ...state.tweet.content.poll,
                                    options: state.tweet.content.poll.options.map((opt) =>
                                        opt.id === id ? { ...opt, text } : opt
                                    ),
                                }
                                : undefined,
                        },
                    },
                })),

            updatePollVotes: (id, votes) =>
                set((state) => {
                    if (!state.tweet.content.poll) return state
                    const newOptions = state.tweet.content.poll.options.map((opt) =>
                        opt.id === id ? { ...opt, votes } : opt
                    )
                    return {
                        tweet: {
                            ...state.tweet,
                            content: {
                                ...state.tweet.content,
                                poll: {
                                    ...state.tweet.content.poll,
                                    options: newOptions,
                                    totalVotes: newOptions.reduce((sum, opt) => sum + opt.votes, 0),
                                },
                            },
                        },
                    }
                }),

            addPollOption: () =>
                set((state) => {
                    if (!state.tweet.content.poll) return state
                    if (state.tweet.content.poll.options.length >= 4) return state
                    const newId = String(Date.now())
                    return {
                        tweet: {
                            ...state.tweet,
                            content: {
                                ...state.tweet.content,
                                poll: {
                                    ...state.tweet.content.poll,
                                    options: [
                                        ...state.tweet.content.poll.options,
                                        { id: newId, text: `Option ${state.tweet.content.poll.options.length + 1}`, votes: 0 },
                                    ],
                                },
                            },
                        },
                    }
                }),

            removePollOption: (id) =>
                set((state) => {
                    if (!state.tweet.content.poll) return state
                    if (state.tweet.content.poll.options.length <= 2) return state
                    const newOptions = state.tweet.content.poll.options.filter((opt) => opt.id !== id)
                    return {
                        tweet: {
                            ...state.tweet,
                            content: {
                                ...state.tweet.content,
                                poll: {
                                    ...state.tweet.content.poll,
                                    options: newOptions,
                                    totalVotes: newOptions.reduce((sum, opt) => sum + opt.votes, 0),
                                },
                            },
                        },
                    }
                }),

            setPollDuration: (duration) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: {
                            ...state.tweet.content,
                            poll: state.tweet.content.poll
                                ? { ...state.tweet.content.poll, duration }
                                : undefined,
                        },
                    },
                })),

            setPollShowResults: (show) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        content: {
                            ...state.tweet.content,
                            poll: state.tweet.content.poll
                                ? { ...state.tweet.content.poll, showResults: show }
                                : undefined,
                        },
                    },
                })),

            // Card Type Actions
            setCardType: (type) =>
                set((state) => ({
                    tweet: { ...state.tweet, cardType: type },
                })),

            // Thread Actions
            addThreadItem: () =>
                set((state) => {
                    const currentItems = state.tweet.thread?.items || []
                    if (currentItems.length >= 10) return state // Max 10 tweets in thread
                    const newItem: ThreadItem = {
                        id: String(Date.now()),
                        text: `Tweet ${currentItems.length + 1}`,
                        mediaUrl: undefined,
                    }
                    return {
                        tweet: {
                            ...state.tweet,
                            thread: {
                                ...state.tweet.thread,
                                items: [...currentItems, newItem],
                                showConnector: state.tweet.thread?.showConnector ?? true,
                            },
                        },
                    }
                }),

            removeThreadItem: (id) =>
                set((state) => {
                    const currentItems = state.tweet.thread?.items || []
                    if (currentItems.length <= 2) return state // Min 2 tweets in thread
                    return {
                        tweet: {
                            ...state.tweet,
                            thread: {
                                ...state.tweet.thread,
                                items: currentItems.filter((item) => item.id !== id),
                                showConnector: state.tweet.thread?.showConnector ?? true,
                            },
                        },
                    }
                }),

            updateThreadItem: (id, text) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        thread: state.tweet.thread
                            ? {
                                ...state.tweet.thread,
                                items: state.tweet.thread.items.map((item) =>
                                    item.id === id ? { ...item, text } : item
                                ),
                            }
                            : undefined,
                    },
                })),

            updateThreadItemMedia: (id, mediaUrl) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        thread: state.tweet.thread
                            ? {
                                ...state.tweet.thread,
                                items: state.tweet.thread.items.map((item) =>
                                    item.id === id ? { ...item, mediaUrl } : item
                                ),
                            }
                            : undefined,
                    },
                })),

            reorderThreadItems: (items) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        thread: state.tweet.thread
                            ? { ...state.tweet.thread, items }
                            : undefined,
                    },
                })),

            setThreadConnector: (show) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        thread: state.tweet.thread
                            ? { ...state.tweet.thread, showConnector: show }
                            : undefined,
                    },
                })),

            // Quote Tweet Actions
            setQuoteTweetEnabled: (enabled) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        quotedTweet: state.tweet.quotedTweet
                            ? { ...state.tweet.quotedTweet, enabled }
                            : {
                                enabled,
                                profile: {
                                    displayName: 'Quoted User',
                                    username: 'quoteduser',
                                    avatarUrl: undefined,
                                    verified: false,
                                },
                                text: 'Original tweet text',
                                timestamp: new Date(),
                                mediaUrl: undefined,
                            },
                    },
                })),

            setQuoteTweetProfile: (profile) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        quotedTweet: state.tweet.quotedTweet
                            ? {
                                ...state.tweet.quotedTweet,
                                profile: { ...state.tweet.quotedTweet.profile, ...profile },
                            }
                            : undefined,
                    },
                })),

            setQuoteTweetText: (text) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        quotedTweet: state.tweet.quotedTweet
                            ? { ...state.tweet.quotedTweet, text }
                            : undefined,
                    },
                })),

            setQuoteTweetMedia: (mediaUrl) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        quotedTweet: state.tweet.quotedTweet
                            ? { ...state.tweet.quotedTweet, mediaUrl }
                            : undefined,
                    },
                })),

            setTweetTheme: (theme) =>
                set((state) => ({
                    tweet: { ...state.tweet, theme },
                })),

            // Metrics Actions
            setShowMetrics: (show) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, showMetrics: show },
                    },
                    twitterMetrics: { ...state.twitterMetrics, showMetrics: show },
                    threadsMetrics: { ...state.threadsMetrics, showMetrics: show },
                    linkedinMetrics: { ...state.linkedinMetrics, showMetrics: show },
                })),

            setReplies: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, replies: count },
                    },
                    twitterMetrics: { ...state.twitterMetrics, replies: count },
                    threadsMetrics: { ...state.threadsMetrics, replies: count },
                })),

            setReposts: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, reposts: count },
                    },
                    twitterMetrics: { ...state.twitterMetrics, reposts: count },
                    threadsMetrics: { ...state.threadsMetrics, reposts: count },
                    linkedinMetrics: { ...state.linkedinMetrics, reposts: count },
                })),

            setLikes: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, likes: count },
                    },
                    twitterMetrics: { ...state.twitterMetrics, likes: count },
                    threadsMetrics: { ...state.threadsMetrics, likes: count },
                })),

            setBookmarks: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, bookmarks: count },
                    },
                    twitterMetrics: { ...state.twitterMetrics, bookmarks: count },
                })),

            setViews: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, views: count },
                    },
                    twitterMetrics: { ...state.twitterMetrics, views: count },
                })),

            // LinkedIn-specific metrics actions
            setReactions: (count) =>
                set((state) => ({
                    linkedinMetrics: { ...state.linkedinMetrics, reactions: count },
                })),

            setComments: (count) =>
                set((state) => ({
                    linkedinMetrics: { ...state.linkedinMetrics, comments: count },
                })),

            // Design Actions
            setTemplateId: (id) => {
                const template = TEMPLATES.find((t) => t.id === id)
                if (!template) {
                    set((state) => ({
                        design: { ...state.design, templateId: id },
                    }))
                    return
                }
                // Apply all template settings
                set((state) => ({
                    design: {
                        ...state.design,
                        templateId: id,
                        shadow: template.shadow,
                        borderRadius: template.borderRadius,
                        fontWeight: template.fontWeight,
                        fontFamily: template.fontFamily,
                    },
                }))
            },

            setBackgroundType: (type) =>
                set((state) => ({
                    design: { ...state.design, backgroundType: type },
                })),

            setBackgroundColor: (color) =>
                set((state) => ({
                    design: { ...state.design, backgroundColor: color },
                })),

            setGradient: (gradient) =>
                set((state) => ({
                    design: { ...state.design, gradient },
                })),

            setPatternType: (pattern) =>
                set((state) => ({
                    design: { ...state.design, patternType: pattern },
                })),

            setBackgroundImageUrl: (url) =>
                set((state) => ({
                    design: { ...state.design, backgroundImageUrl: url },
                })),



            setPadding: (padding) =>
                set((state) => ({
                    design: { ...state.design, padding },
                })),

            setScale: (scale) =>
                set((state) => ({
                    design: { ...state.design, scale },
                })),

            setShadow: (shadow) =>
                set((state) => ({
                    design: { ...state.design, shadow },
                })),

            setShadowIntensity: (intensity) =>
                set((state) => ({
                    design: { ...state.design, shadowIntensity: intensity },
                })),

            setCardScale: (cardScale) =>
                set((state) => ({
                    design: { ...state.design, cardScale },
                })),

            setFontSizeMultiplier: (multiplier) =>
                set((state) => ({
                    design: { ...state.design, fontSizeMultiplier: multiplier },
                })),

            // Animation Actions
            setAnimationType: (type) =>
                set((state) => ({
                    animation: { ...state.animation, type, enabled: type !== 'none' },
                })),

            setAnimationEnabled: (enabled) =>
                set((state) => ({
                    animation: { ...state.animation, enabled },
                })),

            setAnimationSpeed: (speed) =>
                set((state) => ({
                    animation: { ...state.animation, speed },
                })),

            setAnimationDelay: (delay) =>
                set((state) => ({
                    animation: { ...state.animation, delay },
                })),

            setAnimationLoop: (loop) =>
                set((state) => ({
                    animation: { ...state.animation, loop },
                })),

            setShowCursor: (show) =>
                set((state) => ({
                    animation: { ...state.animation, showCursor: show },
                })),

            // Export Actions
            setExportPreset: (preset) => {
                const size = EXPORT_SIZES[preset]
                set((state) => ({
                    export: {
                        ...state.export,
                        preset,
                        width: size.width,
                        height: size.height,
                    },
                }))
            },

            setExportFormat: (format) =>
                set((state) => ({
                    export: { ...state.export, format },
                })),

            setCustomSize: (width, height) =>
                set((state) => ({
                    export: { ...state.export, preset: 'custom', width, height },
                })),

            setIsExporting: (exporting) =>
                set({ isExporting: exporting }),

            setExportProgress: (progress) =>
                set({ exportProgress: progress }),

            // Quick Preset Action
            applyQuickPreset: (presetId) => {
                const preset = QUICK_PRESETS.find((p) => p.id === presetId)
                if (!preset) return

                const size = EXPORT_SIZES[preset.size]

                set((state) => ({
                    design: {
                        ...state.design,
                        templateId: preset.templateId,
                        backgroundType: preset.backgroundType,
                        backgroundColor: preset.backgroundColor,
                        gradient: preset.gradient,
                    },
                    export: {
                        ...state.export,
                        preset: preset.size,
                        width: size.width,
                        height: size.height,
                    },
                }))
            },

            // History Actions
            saveToHistory: () => {
                const { tweet, design, history, historyIndex } = get()
                const newHistory = history.slice(0, historyIndex + 1)
                newHistory.push({ tweet: structuredClone(tweet), design: structuredClone(design) })

                // Keep only last 20 states
                if (newHistory.length > 20) {
                    newHistory.shift()
                }

                set({
                    history: newHistory,
                    historyIndex: newHistory.length - 1,
                })
            },

            undo: () => {
                const { history, historyIndex } = get()
                if (historyIndex > 0) {
                    const prevState = history[historyIndex - 1]
                    set({
                        tweet: structuredClone(prevState.tweet),
                        design: structuredClone(prevState.design),
                        historyIndex: historyIndex - 1,
                    })
                }
            },

            redo: () => {
                const { history, historyIndex } = get()
                if (historyIndex < history.length - 1) {
                    const nextState = history[historyIndex + 1]
                    set({
                        tweet: structuredClone(nextState.tweet),
                        design: structuredClone(nextState.design),
                        historyIndex: historyIndex + 1,
                    })
                }
            },

            // Reset
            reset: () =>
                set({
                    platform: 'twitter',
                    tweet: initialTweet,
                    profile: initialProfile,
                    twitterMetrics: initialTwitterMetrics,
                    threadsMetrics: initialThreadsMetrics,
                    linkedinMetrics: initialLinkedInMetrics,
                    design: initialDesign,
                    animation: initialAnimation,
                    export: initialExport,
                    isExporting: false,
                    exportProgress: 0,
                }),
        }),
        {
            name: 'tweet-studio-storage',
            partialize: (state) => ({
                // Only persist settings, not the tweet content
                design: state.design,
                export: state.export,
            }),
        }
    )
)
