import { useState, useEffect } from 'react'
import type { AnimationType } from '../-types'

interface AnimatedTextProps {
    text: string
    animationType: AnimationType
    active: boolean
    speed?: number
    showCursor?: boolean
    loop?: boolean
    delay?: number
    cursorColor?: string
}

export function AnimatedText({
    text,
    animationType,
    active,
    speed = 30,
    showCursor = true,
    loop = false,
    delay = 0,
    cursorColor = '#1DA1F2'
}: AnimatedTextProps) {
    const [display, setDisplay] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const [cursorVisible, setCursorVisible] = useState(true)
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'running' | 'complete'>('idle')

    // Typewriter animation logic
    useEffect(() => {
        if (!active || animationType !== 'typewriter') {
            setDisplay(text)
            setIsAnimating(false)
            return
        }

        let i = 0
        let timer: NodeJS.Timeout
        let loopTimer: NodeJS.Timeout

        const startTyping = () => {
            setDisplay('')
            setIsAnimating(true)
            setAnimationPhase('running')
            i = 0

            timer = setInterval(() => {
                i++
                setDisplay(text.slice(0, i))

                if (i >= text.length) {
                    clearInterval(timer)
                    setIsAnimating(false)
                    setAnimationPhase('complete')

                    if (loop) {
                        loopTimer = setTimeout(startTyping, 2000)
                    }
                }
            }, 1000 / speed)
        }

        const delayTimer = setTimeout(startTyping, delay * 1000)

        return () => {
            clearTimeout(delayTimer)
            clearInterval(timer)
            clearTimeout(loopTimer)
        }
    }, [text, active, speed, loop, delay, animationType])

    // CSS animation restart for non-typewriter
    useEffect(() => {
        if (!active || animationType === 'typewriter' || animationType === 'none') {
            setAnimationPhase('idle')
            return
        }

        const delayTimer = setTimeout(() => {
            setAnimationPhase('running')
            
            // For looping animations
            if (loop) {
                const loopAnimation = () => {
                    setAnimationPhase('idle')
                    setTimeout(() => setAnimationPhase('running'), 50)
                }
                const duration = getDurationForAnimation(animationType)
                const interval = setInterval(loopAnimation, duration + 2000)
                return () => clearInterval(interval)
            }
        }, delay * 1000)

        return () => clearTimeout(delayTimer)
    }, [active, animationType, loop, delay])

    // Cursor blink
    useEffect(() => {
        if (!active || !showCursor || animationType !== 'typewriter') return
        const interval = setInterval(() => setCursorVisible(v => !v), 530)
        return () => clearInterval(interval)
    }, [active, showCursor, animationType])

    // If not active, show plain text
    if (!active || animationType === 'none') {
        return <span>{text}</span>
    }

    // Typewriter
    if (animationType === 'typewriter') {
        return (
            <span>
                {display}
                {showCursor && (isAnimating || cursorVisible) && (
                    <span 
                        className="inline-block w-[2px] h-[1em] ml-0.5 animate-pulse align-middle" 
                        style={{ backgroundColor: cursorColor }}
                    />
                )}
            </span>
        )
    }

    // CSS-based animations
    const animationClass = getAnimationClass(animationType, animationPhase)
    
    return (
        <span className={animationClass}>
            {text}
        </span>
    )
}

function getDurationForAnimation(type: AnimationType): number {
    switch (type) {
        case 'fade': return 1000
        case 'slide-up': return 800
        case 'bounce': return 1000
        case 'pop': return 600
        case 'highlight': return 1500
        case 'glow': return 2000
        default: return 1000
    }
}

function getAnimationClass(type: AnimationType, phase: string): string {
    if (phase !== 'running') return 'opacity-0'
    
    switch (type) {
        case 'fade':
            return 'animate-fade-in'
        case 'slide-up':
            return 'animate-slide-up'
        case 'bounce':
            return 'animate-bounce-in'
        case 'pop':
            return 'animate-pop'
        case 'highlight':
            return 'animate-highlight'
        case 'glow':
            return 'animate-glow'
        default:
            return ''
    }
}

