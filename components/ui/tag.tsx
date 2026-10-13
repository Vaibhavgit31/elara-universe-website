import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Subject colours appear only on small things like tags (PLAYBOOK colour rules).
export const subjectTag = {
  hindi: 'bg-hindi-tint border-hindi',
  computer: 'bg-computer-tint border-computer',
  drawing: 'bg-drawing-tint border-drawing',
  neutral: 'bg-sage-100 border-sage',
}

export type Subject = Exclude<keyof typeof subjectTag, 'neutral'>

export function Tag({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: keyof typeof subjectTag
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-l-4 px-3 py-1 text-small font-semibold text-evergreen',
        subjectTag[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
