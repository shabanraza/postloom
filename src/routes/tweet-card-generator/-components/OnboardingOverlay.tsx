import { useState, useEffect } from 'react'
import { X, ChevronRight, LayoutTemplate, Type, Palette, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    target?: string // CSS selector to highlight
    position: 'top' | 'bottom' | 'left' | 'right'
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to Postloom',
        description: 'Create beautiful social media cards for Twitter/X, Threads, and LinkedIn. Let\'s take a quick tour!',
        icon: <LayoutTemplate className="h-5 w-5 text-brand" />,
        position: 'bottom',
    },
    {
        id: 'platform',
        title: 'Choose Your Platform',
        description: 'Select Twitter/X, Threads, or LinkedIn to create cards styled for each social network.',
        icon: <Type className="h-5 w-5 text-brand" />,
        position: 'bottom',
    },
    {
        id: 'content',
        title: 'Add Your Content',
        description: 'Use the Content tab to add your post text, profile info, and engagement metrics.',
        icon: <Type className="h-5 w-5 text-brand" />,
        position: 'right',
    },
    {
        id: 'design',
        title: 'Customize Design',
        description: 'Switch to Design, Background, and Animation tabs to style your card with colors, gradients, and effects.',
        icon: <Palette className="h-5 w-5 text-brand" />,
        position: 'right',
    },
    {
        id: 'export',
        title: 'Export Your Creation',
        description: 'Click Export to download as PNG for static posts or GIF for animated content. Ready to share!',
        icon: <Download className="h-5 w-5 text-brand" />,
        position: 'bottom',
    },
]

const STORAGE_KEY = 'postloom-onboarding-complete'

export function OnboardingOverlay() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        // Check if onboarding was already completed
        const completed = localStorage.getItem(STORAGE_KEY)
        if (!completed) {
            // Small delay to let the app load
            const timer = setTimeout(() => setIsVisible(true), 500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleSkip = () => {
        handleComplete()
    }

    const handleComplete = () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    const step = ONBOARDING_STEPS[currentStep]
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" onClick={handleSkip} />

            {/* Modal Card */}
            <div className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                                {step.icon}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                                </p>
                                <h3 className="font-semibold text-foreground">
                                    {step.title}
                                </h3>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                            onClick={handleSkip}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-1.5 pb-4">
                        {ONBOARDING_STEPS.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    index === currentStep
                                        ? "bg-brand w-6"
                                        : index < currentStep
                                            ? "bg-brand"
                                            : "bg-muted"
                                )}
                            />
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 border-t border-border">
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={handleSkip}
                        >
                            Skip tutorial
                        </Button>
                        <Button
                            className="gap-2 bg-brand hover:bg-brand/90 text-brand-foreground"
                            onClick={handleNext}
                        >
                            {isLastStep ? 'Get Started' : 'Next'}
                            {!isLastStep && <ChevronRight className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

// Hook to reset onboarding (for testing or settings)
export function useOnboarding() {
    const resetOnboarding = () => {
        localStorage.removeItem(STORAGE_KEY)
        window.location.reload()
    }

    const isOnboardingComplete = () => {
        return localStorage.getItem(STORAGE_KEY) === 'true'
    }

    return { resetOnboarding, isOnboardingComplete }
}

