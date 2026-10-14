'use client'

import { usePathname } from 'next/navigation'
import { m } from 'framer-motion'
import { NAV, isActive } from '@/components/frame/nav'
import { TurnLink } from '@/components/ui/turn-link'
import { cn } from '@/lib/cn'

// Desktop menu: bookmark ribbons hanging from the top edge of the glass bar. The current page's
// ribbon hangs longer; each ribbon sways on hover; all shorten a little once the page scrolls.
export function RibbonNav({ compact, className }: { compact?: boolean; className?: string }) {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Main"
      data-testid="ribbons"
      className={cn('hidden items-start gap-1.5 self-start md:flex', className)}
    >
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
                'flex w-[68px] items-end justify-center pb-4 text-center text-[12px] leading-tight font-bold tracking-wide shadow-page transition-[height] duration-300 [clip-path:polygon(0_0,100%_0,100%_100%,50%_calc(100%-10px),0_100%)] lg:w-[76px] xl:w-[84px]',
                compact ? 'h-11 pb-3.5' : 'h-14',
                active ? 'bg-brass text-evergreen' : 'bg-forest text-cream',
              )}
              style={{ transformOrigin: 'top center' }}
              initial={false}
              animate={{ y: active ? 0 : compact ? -10 : -14 }}
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
