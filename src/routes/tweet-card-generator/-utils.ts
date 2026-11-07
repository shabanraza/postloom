import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a count the way X shows it (7, 1.3K, 1K, 2.4M). Zero or missing
 * counts return '' so cards show just the icon.
 */
export function formatNumber(num: number): string {
    if (!Number.isFinite(num) || num <= 0) return ''
    const compact = (value: number, unit: string) =>
        value.toFixed(1).replace(/\.0$/, '') + unit
    // 999,950 and up would round to "1000K", so it becomes "1M"
    if (num >= 999_950) return compact(num / 1_000_000, 'M')
    if (num >= 1_000) return compact(num / 1_000, 'K')
    return String(num)
}

/**
 * Format timestamp in Twitter style
 */
export function formatTimestamp(date: Date): string {
    return format(date, "h:mm a '·' MMM d, yyyy")
}

/**
 * Generate filename for export
 */
export function generateFilename(
    username: string,
    format: 'png' | 'gif'
): string {
    const timestamp = format === 'png'
        ? new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
        : new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)

    const safeUsername = username.replace(/[^a-zA-Z0-9]/g, '') || 'tweet'

    return `postloom_${safeUsername}_${timestamp}.${format}`
}

/**
 * Trigger file download
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Calculate animation duration
 */
export function calculateAnimationDuration(
    textLength: number,
    speed: number
): number {
    return textLength / speed
}

/**
 * Calculate frame count for GIF
 */
export function calculateFrameCount(
    textLength: number,
    speed: number,
    fps: number
): number {
    const duration = calculateAnimationDuration(textLength, speed)
    return Math.ceil(duration * fps)
}

/**
 * Get gradient CSS string
 */
export function getGradientStyle(
    colors: string[],
    direction: string
): string {
    const directionMap: Record<string, string> = {
        'to-t': 'to top',
        'to-tr': 'to top right',
        'to-r': 'to right',
        'to-br': 'to bottom right',
        'to-b': 'to bottom',
        'to-bl': 'to bottom left',
        'to-l': 'to left',
        'to-tl': 'to top left',
    }

    return `linear-gradient(${directionMap[direction] || 'to bottom'}, ${colors.join(', ')})`
}

/**
 * Get shadow CSS based on preset
 */
export function getShadowStyle(preset: string): string {
    const shadows: Record<string, string> = {
        none: 'none',
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        hard: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        glow: '0 0 40px rgba(59, 130, 246, 0.3)',
    }

    return shadows[preset] || 'none'
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

/**
 * Wait for next animation frame
 */
export function nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
