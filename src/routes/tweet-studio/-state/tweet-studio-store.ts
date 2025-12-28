import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
    Tweet,
    TweetCardTheme,
    DesignSettings,
    AnimationSettings,
    ExportSettings,
    ExportPreset,
} from '../-types'
import {
    EXPORT_SIZES,
    ANIMATION_DEFAULTS,
    PADDING_RANGE,
    QUICK_PRESETS,
    TEMPLATES,
} from '../-constants'

interface TweetStudioState {
    // Tweet Data
    tweet: Tweet

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

    // Actions - Tweet
    setDisplayName: (name: string) => void
    setUsername: (username: string) => void
    setAvatarUrl: (url: string | undefined) => void
    setVerified: (verified: boolean) => void
    setTweetText: (text: string) => void
    setReplyTo: (username: string | undefined) => void
    setShowTimestamp: (show: boolean) => void
    setTimestamp: (date: Date) => void
    setTweetTheme: (theme: TweetCardTheme) => void

    // Actions - Metrics
    setShowMetrics: (show: boolean) => void
    setReplies: (count: number) => void
    setReposts: (count: number) => void
    setLikes: (count: number) => void
    setBookmarks: (count: number) => void
    setViews: (count: number) => void

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
    setCardScale: (scale: number) => void

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
}

const initialTweet: Tweet = {
    profile: {
        displayName: 'John Doe',
        username: 'johndoe',
        avatarUrl: undefined,
        verified: true,
    },
    content: {
        text: 'Ah, the new feature is finally here! 🚀 #LaunchDay',
        replyTo: undefined,
        showTimestamp: true,
        timestamp: new Date(),
    },
    metrics: {
        showMetrics: true,
        replies: 12,
        reposts: 45,
        likes: 234,
        bookmarks: 8,
        views: 1250,
    },
    theme: 'light',
}

const initialDesign: DesignSettings = {
    templateId: 'minimal',
    backgroundType: 'gradient',
    backgroundColor: '#3b82f6',
    gradient: {
        colors: ['#3b82f6', '#8b5cf6'],
        direction: 'to-br',
    },
    patternType: undefined,
    backgroundImageUrl: undefined,
    padding: PADDING_RANGE.default,
    scale: 1,
    shadow: 'soft',
    // Card-level styling defaults (from minimal template)
    cardScale: 1,
    borderRadius: 16,
    fontWeight: 400,
    fontFamily: 'system-ui, sans-serif',
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

export const useTweetStudioStore = create<TweetStudioState>()(
    persist(
        (set, get) => ({
            // Initial State
            tweet: initialTweet,
            design: initialDesign,
            animation: initialAnimation,
            export: initialExport,
            isExporting: false,
            exportProgress: 0,
            history: [],
            historyIndex: -1,
            studioMode: 'static',

            setStudioMode: (mode) => set({ studioMode: mode }),

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
                })),

            setUsername: (username) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, username: username.replace('@', '') },
                    },
                })),

            setAvatarUrl: (url) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, avatarUrl: url },
                    },
                })),

            setVerified: (verified) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        profile: { ...state.tweet.profile, verified },
                    },
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
                })),

            setReplies: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, replies: count },
                    },
                })),

            setReposts: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, reposts: count },
                    },
                })),

            setLikes: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, likes: count },
                    },
                })),

            setBookmarks: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, bookmarks: count },
                    },
                })),

            setViews: (count) =>
                set((state) => ({
                    tweet: {
                        ...state.tweet,
                        metrics: { ...state.tweet.metrics, views: count },
                    },
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

            setCardScale: (cardScale) =>
                set((state) => ({
                    design: { ...state.design, cardScale },
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
                    tweet: initialTweet,
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
