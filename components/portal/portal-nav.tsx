'use client'

import {
  BookOpenText,
  ChevronDown,
  CircleHelp,
  FileText,
  PenLine,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { TurnLink } from '@/components/ui/turn-link'
import { cn } from '@/lib/cn'

type Item = { href: string; label: string; icon: LucideIcon; match: (path: string) => boolean }

const items: Item[] = [
  {
    href: '/web-support',
    label: 'My books',
    icon: BookOpenText,
    match: (p) => p === '/web-support/' || p.startsWith('/web-support/books'),
  },
  {
    href: '/web-support/tests',
    label: 'My tests',
    icon: FileText,
    match: (p) => p.startsWith('/web-support/tests'),
  },
  {
    href: '/web-support/test-maker',
    label: 'Test Maker',
    icon: PenLine,
    match: (p) => p.startsWith('/web-support/test-maker'),
  },
  {
    href: '/web-support/help',
    label: 'Help & Doubts',
    icon: CircleHelp,
    match: (p) => p.startsWith('/web-support/help'),
  },
  {
    href: '/web-support/profile',
    label: 'Profile',
    icon: UserRound,
    match: (p) => p.startsWith('/web-support/profile'),
  },
]
const adminItem: Item = {
  href: '/admin',
  label: 'Admin',
  icon: ShieldCheck,
  match: (p) => p.startsWith('/admin'),
}

/**
 * The portal's glass sidebar: school and name on top, the portal links, sign out. Sticky beside
 * the page from 768px; on phones it folds into a "Portal menu" bar above the page.
 */
export function PortalNav({
  name,
  school,
  admin,
}: {
  name: string
  school: string
  admin: boolean
}) {
  // With trailingSlash the path is "/web-support/…/"; normalise so either form matches.
  const pathname = usePathname().replace(/\/?$/, '/')
  const [open, setOpen] = useState(false)
  const links = admin ? [...items, adminItem] : items
  return (
    <Glass
      radius="lg"
      spotlight={false}
      className="p-4 md:sticky md:top-[calc(var(--topbar-h)+1rem)] md:p-6 print:hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate eyebrow">{school || 'Web Support'}</p>
          <p className="truncate font-heading text-lg font-bold" data-testid="portal-user">
            {name}
          </p>
          {admin && <Tag className="mt-1">Admin</Tag>}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="portal-links"
          onClick={() => setOpen(!open)}
          className="focus-glow inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-4 text-small font-semibold text-forest hover:bg-mint md:hidden"
        >
          Portal menu
          <ChevronDown
            aria-hidden
            size={18}
            className={cn('transition-transform', open && 'rotate-180')}
          />
        </button>
      </div>
      <nav
        id="portal-links"
        aria-label="Web Support"
        className={cn('mt-4 border-t border-sage-100 pt-4', !open && 'max-md:hidden')}
      >
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname)
            return (
              <li key={href}>
                <TurnLink
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'focus-glow flex min-h-11 items-center gap-3 rounded-sm px-3 font-semibold',
                    active ? 'bg-mint text-evergreen' : 'text-forest hover:bg-white/60',
                  )}
                >
                  <Icon aria-hidden size={20} strokeWidth={active ? 2.4 : 2} />
                  {label}
                </TurnLink>
              </li>
            )
          })}
        </ul>
        <SignOutButton className="mt-4 w-full border-t border-sage-100 pt-4" />
      </nav>
    </Glass>
  )
}
