'use client'

import { GraduationCap, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { useSession } from '@/lib/session'

/** "Teacher login" for visitors, "My portal" once logged in. The label hides on narrow bars. */
export function TeacherButton({
  className,
  label = true,
}: {
  className?: string
  label?: boolean
}) {
  const session = useSession()
  const [href, text, Icon] = session
    ? ['/web-support', 'My portal', GraduationCap]
    : ['/login', 'Teacher login', LogIn]
  return (
    <Button
      href={href}
      variant={session ? 'brass' : 'primary'}
      className={cn('min-h-11 px-4 py-1.5 text-small', !label && 'px-3', className)}
    >
      <Icon aria-hidden size={18} />
      <span className={cn(!label && 'sr-only')}>{text}</span>
    </Button>
  )
}
