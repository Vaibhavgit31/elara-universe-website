'use client'

import { GraduationCap, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { useSession } from '@/lib/session'

/** "Teacher login" for visitors, "My portal" once logged in. In the top bar the label shows
 *  from 1280px only (icon-only before that); in the phone sheet it always shows. */
export function TeacherButton({
  className,
  iconOnlyUntilXl = false,
}: {
  className?: string
  iconOnlyUntilXl?: boolean
}) {
  const session = useSession()
  const [href, text, Icon] = session
    ? ['/web-support', 'My portal', GraduationCap]
    : ['/login', 'Teacher login', LogIn]
  return (
    <Button
      href={href}
      variant={session ? 'brass' : 'primary'}
      className={cn(
        'min-h-11 py-1.5 text-small',
        iconOnlyUntilXl ? 'px-3 xl:px-4' : 'px-4',
        className,
      )}
    >
      <Icon aria-hidden size={18} />
      <span className={cn(iconOnlyUntilXl && 'sr-only xl:not-sr-only')}>{text}</span>
    </Button>
  )
}
