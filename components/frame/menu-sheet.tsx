'use client'

import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useRef } from 'react'
import { StickerBookButton } from '@/components/extras/sticker-book'
import { NAV, isActive } from '@/components/frame/nav'
import { TeacherButton } from '@/components/frame/teacher-button'
import { TurnLink } from '@/components/ui/turn-link'
import { cn } from '@/lib/cn'

/** Phone menu: a glass sheet that drops from the top bar with every link and the teacher login. */
export function MenuSheet() {
  const dialog = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()
  const close = () => dialog.current?.close()
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label="Open menu"
        className="flex size-11 items-center justify-center rounded-full text-forest hover:bg-sage-100 md:hidden"
      >
        <Menu aria-hidden size={24} />
      </button>
      <dialog
        ref={dialog}
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="glass m-0 mt-[var(--topbar-h)] w-full max-w-none rounded-t-none rounded-b-lg border-x-0 border-t-0 p-0 backdrop:bg-evergreen/40 open:animate-sheet motion-reduce:animate-none"
      >
        <nav
          aria-label="Main"
          data-testid="menu-sheet"
          className="container-page flex flex-col gap-1 py-4"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href)
            return (
              <TurnLink
                key={href}
                href={href}
                onClick={close}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-12 items-center gap-3 rounded-md px-4 font-semibold',
                  active ? 'bg-hindi-tint text-evergreen' : 'text-forest hover:bg-sage-100/60',
                )}
              >
                <Icon aria-hidden size={20} />
                {label}
              </TurnLink>
            )
          })}
          <div className="mt-3 flex items-center justify-between gap-3 px-2">
            <TeacherButton />
            <StickerBookButton />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center rounded-full text-forest hover:bg-sage-100"
            >
              <X aria-hidden size={22} />
            </button>
          </div>
        </nav>
      </dialog>
    </>
  )
}
