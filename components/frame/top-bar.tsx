'use client'

import Image from 'next/image'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { FestivalTouches } from '@/components/extras/festival-touches'
import { StickerBookButton } from '@/components/extras/sticker-book'
import { MenuSheet } from '@/components/frame/menu-sheet'
import { RibbonNav } from '@/components/frame/ribbon-nav'
import { TeacherButton } from '@/components/frame/teacher-button'
import { TurnLink } from '@/components/ui/turn-link'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'

/** The glass top bar: fixed on every page, above everything, outside any flip container. It
 *  shrinks a little once the page has scrolled. */
export function TopBar({ today }: { today: string }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))
  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'glass fixed inset-x-0 top-0 z-[100] rounded-none border-x-0 border-t-0 transition-[height] duration-300',
        scrolled ? 'h-[calc(var(--topbar-h)-0.75rem)]' : 'h-[var(--topbar-h)]',
      )}
    >
      <div className="container-page flex h-full items-center gap-2 md:gap-3">
        <TurnLink href="/" aria-label={`${site.shortName} home`} className="shrink-0 rounded">
          {/* Full lockup on phones and from 1280px; the mark alone where the ribbons need the room. */}
          <Image
            src="/brand/logo-horizontal.svg"
            alt=""
            width={1874}
            height={220}
            priority
            className={cn(
              'w-auto transition-[height] duration-300 md:hidden xl:block',
              scrolled ? 'h-6 sm:h-7' : 'h-7 sm:h-8',
            )}
          />
          <Image
            src="/brand/mark.svg"
            alt=""
            width={324}
            height={220}
            className="hidden h-8 w-auto md:block xl:hidden"
          />
        </TurnLink>
        <RibbonNav compact={scrolled} className="ml-auto" />
        <div className="hidden md:block">
          <StickerBookButton />
        </div>
        <TeacherButton className="hidden md:inline-flex xl:hidden" label={false} />
        <TeacherButton className="hidden xl:inline-flex" />
        <MenuSheet />
      </div>
      <FestivalTouches buildDate={today} />
    </header>
  )
}
