import { cn } from '@/lib/utils'

interface PostloomLogoProps {
    className?: string
    showText?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function PostloomLogo({ className, showText = true, size = 'md' }: PostloomLogoProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10'
    }

    const textSizes = {
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl'
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Logo Icon */}
            <svg
                viewBox="0 0 64 64"
                className={cn(sizeClasses[size], "shrink-0")}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Back card */}
                <rect
                    x="10"
                    y="18"
                    width="38"
                    height="26"
                    rx="6"
                    className="fill-slate-400 dark:fill-slate-600"
                />

                {/* Middle card */}
                <rect
                    x="14"
                    y="14"
                    width="38"
                    height="26"
                    rx="6"
                    className="fill-slate-500 dark:fill-slate-500"
                />

                {/* Top card */}
                <rect
                    x="18"
                    y="10"
                    width="38"
                    height="26"
                    rx="6"
                    className="fill-slate-900 dark:fill-white"
                />

                {/* Speech bubble cutout */}
                <path
                    d="M30 20H42C43.1 20 44 20.9 44 22V26C44 27.1 43.1 28 42 28H35L31 31V28H30C28.9 28 28 27.1 28 26V22C28 20.9 28.9 20 30 20Z"
                    className="fill-white dark:fill-slate-900"
                />
            </svg>


            {/* Logo Text */}
            {showText && (
                <span className={cn("font-bold text-slate-900 dark:text-white", textSizes[size])}>
                    Postloom
                </span>
            )}
        </div>
    )
}

