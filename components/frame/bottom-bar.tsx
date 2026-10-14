'use client'

import { usePathname } from 'next/navigation'
import { NAV, isActive } from '@/components/frame/nav'
import { TurnLink } from '@/components/ui/turn-link'
import { cn } from '@/lib/cn'

// Phone menu: a bottom bar of bookmark tabs that stays put while scrolling (Phase 2, Step B).
export function BottomBar() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Main"
      data-testid="bottom-bar"
      className="glass fixed inset-x-0 bottom-0 z-[90] flex min-h-14 rounded-none border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {NAV.map(({ href, short, icon: Icon }) => {
        const active = isActive(pathname, href)
        return (
          <TurnLink
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-t-sm border-t-4 text-[11px] font-bold',
              active
                ? 'border-brass bg-hindi-tint/40 text-evergreen'
                : 'border-transparent text-forest',
            )}
          >
            <Icon aria-hidden size={22} strokeWidth={active ? 2.4 : 2} />
            {short}
          </TurnLink>
        )
      })}
    </nav>
  )
}
