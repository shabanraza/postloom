import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { trackThemeChange } from '@/lib/analytics'

type Theme = 'light' | 'dark'

/**
 * The initial theme is applied before first paint by the inline script in
 * __root.tsx (light by default, dark only if chosen). This button only reads
 * and flips it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  const handleToggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      // storage blocked: the choice lasts for this page view only
    }
    trackThemeChange(next)
  }

  return (
    <Button variant="ghost" size="icon" className="relative size-9" onClick={handleToggle}>
      <Sun className="absolute size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
