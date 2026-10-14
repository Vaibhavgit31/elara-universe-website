import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth/actions'
import { cn } from '@/lib/cn'

/** A form that posts to the sign-out action (works without JavaScript too). */
export const SignOutButton = ({ className }: { className?: string }) => (
  <form action={signOut} className={cn('inline-flex', className)}>
    <Button type="submit" variant="ghost">
      <LogOut aria-hidden size={18} /> Sign out
    </Button>
  </form>
)
