'use client'

import { usePathname } from 'next/navigation'
import { m, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { NAV, isActive } from '@/components/frame/nav'
import { TurnLink } from '@/components/ui/turn-link'
import { cn } from '@/lib/cn'

// Phone menu: a bottom bar of bookmark tabs. Hides while scrolling down, returns on scroll up.
export function BottomBar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    if (Math.abs(y - previous) > 4) setHidden(y > previous && y > 80)
  })

  return (
    <m.nav
      aria-label="Main"
      data-testid="bottom-bar"
      className="fixed inset-x-0 bottom-0 z-40 flex min-h-14 border-t border-sage-100 bg-cream pb-[env(safe-area-inset-bottom)] md:hidden"
      initial={false}
      animate={{ y: hidden ? '100%' : 0 }}
      transition={{ duration: 0.3 }}
    >
      {NAV.map(({ href, short, icon: Icon }) => {
        const active = isActive(pathname, href)
        return (
          <TurnLink
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-t-lg border-t-4 text-[11px] font-bold',
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
    </m.nav>
  )
}
