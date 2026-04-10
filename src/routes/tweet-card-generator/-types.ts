// Postloom Types - Multi-Platform Support

// ============================================
// PLATFORM TYPES
// ============================================

export type Platform = 'twitter' | 'threads' | 'linkedin'

// ============================================
// PROFILE TYPES (Platform-specific)
// ============================================

export type VerificationBadgeType = 'blue' | 'gold' | 'gray' | 'none'

export interface BaseProfile {
    displayName: string
    username: string
    avatarUrl?: string
    verified: boolean
    badgeType?: VerificationBadgeType
}

export interface TwitterProfile extends BaseProfile {
    // Twitter/X specific (uses base fields)
}

export interface ThreadsProfile extends BaseProfile {
    // Threads specific (uses base fields, no verified badge styling differs)
}

export interface LinkedInProfile extends BaseProfile {
    headline?: string  // "Software Engineer at Google"
    company?: string   // "Google"
}

// Union type for all profiles
export type ProfileData = BaseProfile & {
    headline?: string
    company?: string
}

// Legacy alias for backward compatibility
export interface TweetProfile {
    displayName: string
    username: string
    avatarUrl?: string
    verified: boolean
    badgeType?: VerificationBadgeType
}

// ============================================
// CONTENT TYPES
// ============================================

export interface PollOption {
    id: string
    text: string
    votes: number
}

export interface PollData {
    enabled: boolean
    options: PollOption[]
    totalVotes: number
    duration: string // e.g., "1 day left", "Final results"
    showResults: boolean
}

export interface TweetContent {
    text: string
    replyTo?: string // Username being replied to
    showTimestamp: boolean
    timestamp: Date
    mediaUrl?: string // Image URL to display in tweet
    poll?: PollData // Optional poll data
}

// Alias for multi-platform
export type PostContent = TweetContent

// ============================================
// METRICS TYPES (Platform-specific)
// ============================================

export interface TwitterMetrics {
    showMetrics: boolean
    replies: number
    reposts: number
    likes: number
    bookmarks: number
    views: number
}

export interface ThreadsMetrics {
    showMetrics: boolean
    likes: number
    replies: number
    reposts: number
}

export interface LinkedInMetrics {
    showMetrics: boolean
    reactions: number  // Combined reaction count (like, celebrate, support, love, etc.)
    comments: number
    reposts: number
}

// Union type for all metrics
export type PlatformMetrics = TwitterMetrics | ThreadsMetrics | LinkedInMetrics

// Legacy alias for backward compatibility
export type TweetMetrics = TwitterMetrics

// ============================================
// CARD TYPE (Single, Thread, Quote)
// ============================================

export type CardType = 'single' | 'thread' | 'quote'

// ============================================
// THREAD TYPES
// ============================================

export interface ThreadItem {
    id: string
    text: string
    mediaUrl?: string
}

export interface ThreadData {
    items: ThreadItem[]
    showConnector: boolean // Show vertical line connecting tweets
}

// ============================================
// QUOTE TWEET TYPES
// ============================================

export interface QuotedTweet {
    enabled: boolean
    profile: TweetProfile
    text: string
    timestamp: Date
    mediaUrl?: string
}

// ============================================
// POST/TWEET TYPES
// ============================================

export interface Post {
    platform: Platform
    profile: ProfileData
    content: PostContent
    metrics: PlatformMetrics
    theme: CardTheme
}

// Legacy Tweet interface (backward compatible)
export interface Tweet {
    profile: TweetProfile
    content: TweetContent
    metrics: TwitterMetrics
    theme: TweetCardTheme
    // New card type features
    cardType?: CardType
    thread?: ThreadData
    quotedTweet?: QuotedTweet
}

export type TweetCardTheme = 'light' | 'dark' | 'dim'
export type CardTheme = TweetCardTheme

export type BackgroundType = 'solid' | 'gradient' | 'glass' | 'pattern' | 'image'

export interface GradientConfig {
    colors: string[]
    direction: GradientDirection
}

export type GradientDirection =
    | 'to-t'
    | 'to-tr'
    | 'to-r'
    | 'to-br'
    | 'to-b'
    | 'to-bl'
    | 'to-l'
    | 'to-tl'

export type PatternType = 'dots' | 'lines-h' | 'lines-v' | 'lines-d' | 'mesh'

export interface DesignSettings {
    templateId: string
    backgroundType: BackgroundType
    backgroundColor: string
    gradient?: GradientConfig
    patternType?: PatternType
    backgroundImageUrl?: string
    padding: number
    scale: number
    shadow: ShadowPreset
    shadowIntensity: number // 0-100 for shadow slider
    // Card-level styling (from templates)
    cardScale: number
    borderRadius: number
    fontWeight: number
    fontFamily: string
    fontSizeMultiplier: number // 0.5 to 2.0 for font size control
}

export type ShadowPreset = 'none' | 'soft' | 'medium' | 'hard' | 'glow'

export type AnimationType = 'none' | 'typewriter' | 'fade' | 'highlight' | 'slide-up' | 'bounce' | 'pop' | 'glow'

export interface AnimationSettings {
    type: AnimationType
    enabled: boolean
    speed: number // chars per second (20-80)
    delay: number // 0, 0.5, 1 seconds
    loop: boolean
    showCursor: boolean
    fps: number
}

export type ExportPreset = 'instagram' | 'story' | 'linkedin' | 'twitter' | 'custom'

export interface ExportSettings {
    preset: ExportPreset
    width: number
    height: number
    format: 'png' | 'gif'
    quality: number
}

export interface Template {
    id: string
    name: string
    fontFamily: string
    fontWeight: number
    borderRadius: number
    shadow: ShadowPreset
    textAlign: 'left' | 'center'
    lineHeight: number
    isPro: boolean
}

export interface QuickPreset {
    id: string
    name: string
    icon: string
    size: ExportPreset
    templateId: string
    backgroundType: BackgroundType
    backgroundColor: string
    gradient?: GradientConfig
    isPro: boolean
}

// ============================================
// BRAND KIT TYPES
// ============================================

export interface BrandColor {
    id: string
    name: string
    color: string
}

export interface BrandFont {
    id: string
    name: string
    fontFamily: string
    fontWeight: number
}

export interface BrandKit {
    id: string
    name: string
    colors: BrandColor[]
    fonts: BrandFont[]
    logoUrl?: string
    createdAt: Date
}
