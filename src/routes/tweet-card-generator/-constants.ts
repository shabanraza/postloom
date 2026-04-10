import type {
    Template,
    QuickPreset,
    ExportPreset,
} from './-types'

// Export Size Presets
export const EXPORT_SIZES: Record<ExportPreset, { width: number; height: number; label: string }> = {
    instagram: { width: 1080, height: 1080, label: 'Instagram Post' },
    story: { width: 1080, height: 1920, label: 'Instagram Story' },
    linkedin: { width: 1200, height: 627, label: 'LinkedIn Post' },
    twitter: { width: 1600, height: 900, label: 'Twitter/X Post' },
    custom: { width: 1080, height: 1080, label: 'Custom Size' },
}

// Twitter/X Colors
export const TWITTER_COLORS = {
    blue: '#1DA1F2',
    dark: '#15202B',
    dim: '#1E2732',
    light: '#FFFFFF',
    gray: '#536471',
    border: '#2F3336',
    textPrimary: '#E7E9EA',
    textSecondary: '#71767B',
} as const

// Templates
export const TEMPLATES: Template[] = [
    {
        id: 'minimal',
        name: 'Minimal',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 400,
        borderRadius: 16,
        shadow: 'soft',
        textAlign: 'left',
        lineHeight: 1.5,
        isPro: false,
    },
    {
        id: 'bold',
        name: 'Bold',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 600,
        borderRadius: 20,
        shadow: 'hard',
        textAlign: 'left',
        lineHeight: 1.4,
        isPro: false,
    },
    {
        id: 'standard',
        name: 'Standard',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 400,
        borderRadius: 12,
        shadow: 'medium',
        textAlign: 'left',
        lineHeight: 1.5,
        isPro: false,
    },
    {
        id: 'glass',
        name: 'Glass',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 400,
        borderRadius: 24,
        shadow: 'glow',
        textAlign: 'left',
        lineHeight: 1.5,
        isPro: true,
    },
    {
        id: 'neon',
        name: 'Neon',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 500,
        borderRadius: 16,
        shadow: 'glow',
        textAlign: 'left',
        lineHeight: 1.4,
        isPro: true,
    },
    {
        id: 'retro',
        name: 'Retro',
        fontFamily: 'Georgia, serif',
        fontWeight: 400,
        borderRadius: 8,
        shadow: 'hard',
        textAlign: 'left',
        lineHeight: 1.6,
        isPro: true,
    },
    {
        id: 'corporate',
        name: 'Corporate',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 500,
        borderRadius: 8,
        shadow: 'soft',
        textAlign: 'left',
        lineHeight: 1.5,
        isPro: true,
    },
    {
        id: 'handwritten',
        name: 'Handwritten',
        fontFamily: 'cursive',
        fontWeight: 400,
        borderRadius: 20,
        shadow: 'soft',
        textAlign: 'left',
        lineHeight: 1.6,
        isPro: true,
    },
    {
        id: 'tech',
        name: 'Tech',
        fontFamily: 'monospace',
        fontWeight: 400,
        borderRadius: 4,
        shadow: 'medium',
        textAlign: 'left',
        lineHeight: 1.4,
        isPro: true,
    },
    {
        id: 'elegant',
        name: 'Elegant',
        fontFamily: 'Georgia, serif',
        fontWeight: 400,
        borderRadius: 0,
        shadow: 'none',
        textAlign: 'center',
        lineHeight: 1.7,
        isPro: true,
    },
]

// Quick Presets
export const QUICK_PRESETS: QuickPreset[] = [
    {
        id: 'instagram-gradient-blue',
        name: 'Instagram Gradient Blue',
        icon: '🟦',
        size: 'instagram',
        templateId: 'minimal',
        backgroundType: 'gradient',
        backgroundColor: '#1e3a8a',
        gradient: {
            colors: ['#3b82f6', '#8b5cf6'],
            direction: 'to-br',
        },
        isPro: false,
    },
    {
        id: 'instagram-warm-sunset',
        name: 'Instagram Warm Sunset',
        icon: '🟨',
        size: 'instagram',
        templateId: 'bold',
        backgroundType: 'gradient',
        backgroundColor: '#f97316',
        gradient: {
            colors: ['#f97316', '#ec4899'],
            direction: 'to-br',
        },
        isPro: false,
    },
    {
        id: 'story-dark-glass',
        name: 'Story Dark Glass',
        icon: '🌃',
        size: 'story',
        templateId: 'glass',
        backgroundType: 'glass',
        backgroundColor: '#1e293b',
        isPro: false,
    },
    {
        id: 'linkedin-professional',
        name: 'LinkedIn Professional',
        icon: '💼',
        size: 'linkedin',
        templateId: 'corporate',
        backgroundType: 'solid',
        backgroundColor: '#f8fafc',
        isPro: true,
    },
    {
        id: 'linkedin-gradient',
        name: 'LinkedIn Gradient',
        icon: '🔷',
        size: 'linkedin',
        templateId: 'standard',
        backgroundType: 'gradient',
        backgroundColor: '#7c3aed',
        gradient: {
            colors: ['#7c3aed', '#2563eb'],
            direction: 'to-r',
        },
        isPro: true,
    },
    {
        id: 'twitter-dark-mode',
        name: 'Twitter Dark Mode',
        icon: '🖤',
        size: 'twitter',
        templateId: 'standard',
        backgroundType: 'solid',
        backgroundColor: '#000000',
        isPro: true,
    },
    {
        id: 'story-neon',
        name: 'Story Neon',
        icon: '✨',
        size: 'story',
        templateId: 'neon',
        backgroundType: 'gradient',
        backgroundColor: '#0f172a',
        gradient: {
            colors: ['#06b6d4', '#8b5cf6', '#ec4899'],
            direction: 'to-br',
        },
        isPro: true,
    },
]

// Animation Defaults
export const ANIMATION_DEFAULTS = {
    speed: 50, // chars per second
    delay: 0,
    loop: false,
    showCursor: true,
    fps: 20,
} as const

// Background Color Presets
export const COLOR_PRESETS = [
    '#ffffff', // White
    '#f8fafc', // Slate 50
    '#1e293b', // Slate 800
    '#0f172a', // Slate 900
    '#000000', // Black
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
] as const

// Gradient Presets
export const GRADIENT_PRESETS = [
    { colors: ['#3b82f6', '#8b5cf6'], direction: 'to-br' as const },
    { colors: ['#f97316', '#ec4899'], direction: 'to-br' as const },
    { colors: ['#22c55e', '#3b82f6'], direction: 'to-r' as const },
    { colors: ['#7c3aed', '#2563eb'], direction: 'to-r' as const },
    { colors: ['#06b6d4', '#8b5cf6'], direction: 'to-br' as const },
    { colors: ['#f43f5e', '#f97316'], direction: 'to-r' as const },
    { colors: ['#0f172a', '#1e3a8a'], direction: 'to-b' as const },
    { colors: ['#1e293b', '#0f172a'], direction: 'to-b' as const },
] as const

// Pattern Presets
export const PATTERN_PRESETS = [
    { id: 'dots', name: 'Dots', icon: '⚫' },
    { id: 'lines-h', name: 'Horizontal Lines', icon: '═' },
    { id: 'lines-v', name: 'Vertical Lines', icon: '║' },
    { id: 'lines-d', name: 'Diagonal Lines', icon: '╱' },
    { id: 'mesh', name: 'Mesh Grid', icon: '▦' },
] as const

// Padding Range (from PRD: 40-160px)
export const PADDING_RANGE = {
    min: 40,
    max: 160,
    default: 80,
    step: 8,
} as const

// Animation Speed Range
export const ANIMATION_SPEED_RANGE = {
    min: 20,
    max: 80,
    default: 50,
} as const

// Character Limits
export const LIMITS = {
    displayName: 50,
    username: 15,
    tweetText: 280,
} as const

// Social Platforms for Presets
export const SOCIAL_PLATFORMS = [
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'instagram-story', name: 'Instagram Story', color: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-[#0077b5]' },
    { id: 'twitter', name: 'Twitter/X', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', color: 'bg-[#FF0000]' },
]
