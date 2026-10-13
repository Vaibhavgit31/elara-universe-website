import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-forest text-cream hover:bg-evergreen',
  secondary: 'border-2 border-forest text-forest hover:bg-sage-100',
  brass: 'bg-brass text-evergreen hover:bg-gold-ink hover:text-cream',
  ghost: 'text-forest hover:bg-mist',
}

type Props = {
  variant?: keyof typeof variants
  href?: string
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'button'>, 'className' | 'children'>

// Every button is at least 44px tall (PLAYBOOK motion rules) and presses down like a stamp.
export function Button({ variant = 'primary', href, className, children, ...rest }: Props) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-[transform,background-color,color] duration-200 active:translate-y-px active:scale-[0.97]',
    variants[variant],
    className,
  )
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
