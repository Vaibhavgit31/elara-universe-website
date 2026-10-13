'use client'

import { usePathname } from 'next/navigation'
import { m } from 'framer-motion'
import { NAV, isActive } from '@/components/frame/nav'
import { TurnLink } from '@/components/ui/turn-link'
import { cn } from '@/lib/cn'

// Desktop menu: bookmark ribbons hanging from the top edge. The current page's ribbon hangs
// longer; each ribbon sways on hover.
export function RibbonNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="hidden items-start gap-2 md:flex lg:gap-3">
      {NAV.map(({ href, label }) => {
        const active = isActive(pathname, href)
        return (
          <TurnLink
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className="rounded-b-md focus-visible:outline-offset-4"
          >
            <m.span
              className={cn(
                'flex h-[64px] w-[78px] items-end justify-center pb-5 text-[13px] font-bold tracking-wide shadow-page [clip-path:polygon(0_0,100%_0,100%_100%,50%_calc(100%-11px),0_100%)] lg:w-[88px]',
                active ? 'bg-brass text-evergreen' : 'bg-forest text-cream',
              )}
              style={{ transformOrigin: 'top center' }}
              initial={false}
              animate={{ y: active ? 0 : -18 }}
              whileHover={{ rotate: [0, 2.5, -2, 1.2, 0], transition: { duration: 0.7 } }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            >
              {label}
            </m.span>
          </TurnLink>
        )
      })}
    </nav>
  )
}
