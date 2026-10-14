import { cn } from '@/lib/cn'

// Shared by <Button> and by elements that cannot be one (external <a> links); no 'use client'
// here so server components can call it.
const variants = {
  primary: 'bg-leaf-700 text-white hover:bg-forest',
  secondary: 'glass text-forest hover:bg-white/70',
  brass: 'bg-brass text-evergreen hover:bg-gold-ink hover:text-cream',
  ghost: 'text-forest hover:bg-mint',
}

export type Variant = keyof typeof variants

/** Button classes: 44px tall pills that press down like a stamp, with the focus glow. */
export const buttonClass = (variant: Variant = 'primary', className?: string) =>
  cn(
    'focus-glow stamp inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-[background-color,color] duration-200 active:scale-[0.97]',
    variants[variant],
    className,
  )
