import { motion, useReducedMotion } from 'framer-motion'

/**
 * Fades and lifts its children into view once, as they scroll in.
 * For visitors who prefer reduced motion the change is instant. The element
 * is the same either way: swapping to a plain div after hydration would keep
 * the server-rendered `opacity: 0` and hide the content.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={reduce ? { duration: 0 } : { duration: 0.45, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
