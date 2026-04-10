import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { trackThemeChange } from '@/lib/analytics'

type Theme = 'light' | 'dark'

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored)
            applyTheme(stored)
        } else {
            // Check system preference if no stored theme
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const initialTheme = isDark ? 'dark' : 'light'
            setTheme(initialTheme)
            applyTheme(initialTheme)
        }
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement
        root.classList.toggle('dark', newTheme === 'dark')
    }

    const handleToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        applyTheme(newTheme)
        trackThemeChange(newTheme)
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 relative"
            onClick={handleToggle}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 absolute" />
            <Moon className="h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 absolute" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
