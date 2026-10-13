import Image from 'next/image'
import { RibbonNav } from '@/components/frame/ribbon-nav'
import { TurnLink } from '@/components/ui/turn-link'
import { site } from '@/content/site'

export function Header() {
  return (
    <header className="relative z-40 border-t-[6px] border-sage-100 bg-paper">
      <div className="mx-auto flex max-w-7xl items-start justify-between px-4 sm:px-6">
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
        <RibbonNav />
      </div>
    </header>
  )
}
