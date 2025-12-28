// Postloom Types

export interface TweetProfile {
    displayName: string
    username: string
    avatarUrl?: string
    verified: boolean
}

export interface TweetContent {
    text: string
    replyTo?: string // Username being replied to
    showTimestamp: boolean
    timestamp: Date
}

export interface TweetMetrics {
    showMetrics: boolean
    replies: number
    reposts: number
    likes: number
    bookmarks: number
    views: number
}

export interface Tweet {
    profile: TweetProfile
    content: TweetContent
    metrics: TweetMetrics
    theme: TweetCardTheme
}

export type TweetCardTheme = 'light' | 'dark' | 'dim'

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
    // Card-level styling (from templates)
    cardScale: number
    borderRadius: number
    fontWeight: number
    fontFamily: string
}

export type ShadowPreset = 'none' | 'soft' | 'medium' | 'hard' | 'glow'

export type AnimationType = 'none' | 'typewriter' | 'fade' | 'highlight'

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
