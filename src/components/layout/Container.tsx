import { cn } from '@/lib/utils'

/** The one page width used by every marketing and tool page. */
export function Container({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)} {...props} />
}
