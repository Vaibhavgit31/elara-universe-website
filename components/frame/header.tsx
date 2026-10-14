import Image from 'next/image'
import { FestivalTouches } from '@/components/extras/festival-touches'
import { StickerBookButton } from '@/components/extras/sticker-book'
import { RibbonNav } from '@/components/frame/ribbon-nav'
import { TurnLink } from '@/components/ui/turn-link'
import { site } from '@/content/site'
import { isoToday } from '@/lib/events'

export function Header() {
  return (
    <header className="relative z-40 border-t-[6px] border-sage-100 bg-paper">
      <div className="container-page flex items-start justify-between">
        <TurnLink href="/" aria-label={`${site.shortName} home`} className="my-3 rounded">
          {/* Full lockup on phones and large screens; the mark alone where ribbons need the room. */}
          <Image
            src="/brand/logo-horizontal.svg"
            alt=""
            width={1874}
            height={220}
            priority
            className="h-8 w-auto sm:h-9 md:hidden lg:block"
          />
          <Image
            src="/brand/mark.svg"
            alt=""
            width={324}
            height={220}
            className="hidden h-9 w-auto md:block lg:hidden"
          />
        </TurnLink>
        <div className="my-2 mr-3 ml-auto md:mr-6">
          <StickerBookButton />
        </div>
        <RibbonNav />
      </div>
      <FestivalTouches buildDate={isoToday()} />
    </header>
  )
}
