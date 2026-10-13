'use client'

import { Sparkles, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Elu } from '@/components/mascot/elu'
import { siteConfig } from '@/content/site-config'
import { cn } from '@/lib/cn'
import {
  earnSticker,
  stickerForPath,
  stickers,
  useJustEarned,
  useStickers,
  type StickerId,
} from '@/lib/stickers'

const shapes: Record<StickerId, string> = {
  home: 'M20 4C10 10 6 22 20 36c14-14 10-26 0-32Z',
  catalog: 'M8 8h10v24H8zM22 8h10v24H22z',
  about: 'M20 4l4.5 9.5 10.5 1.5-7.6 7.4 1.8 10.4L20 28l-9.2 4.8 1.8-10.4L5 15l10.5-1.5z',
  events: 'M6 12h28v6a3 3 0 0 0 0 6v6H6v-6a3 3 0 0 0 0-6z',
  contact: 'M10 30l2-8 14-14 6 6-14 14zM12 22l6 6',
  resources: 'M8 8h10v10H8zM22 8h10v10H22zM8 22h10v10H8zM24 24h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3z',
}

const Sticker = ({ id, earned }: { id: StickerId; earned: boolean }) => {
  const s = stickers.find((x) => x.id === id)!
  return (
    <svg
      viewBox="0 0 40 40"
      className="size-12"
      role="img"
      aria-label={`${s.label} sticker${earned ? '' : ', not yet earned'}`}
    >
      <circle
        cx="20"
        cy="20"
        r="19"
        fill={earned ? s.color : 'none'}
        stroke={earned ? 'none' : '#8A9A74'}
        strokeDasharray={earned ? undefined : '3 3'}
        opacity={earned ? 0.25 : 1}
      />
      <path
        d={shapes[id]}
        fill={earned ? s.color : 'none'}
        stroke={earned ? '#1B241D' : '#8A9A74'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Earns the sticker for the current page and shows a small note when it is new. */
export function StickerCollector() {
  const pathname = usePathname()
  const earned = useJustEarned()
  useEffect(() => {
    const id = stickerForPath(pathname)
    if (id) earnSticker(id)
  }, [pathname])
  const label = earned && stickers.find((x) => x.id === earned)!.label.toLowerCase()
  return (
    <AnimatePresence>
      {label && (
        <m.p
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-hindi-tint px-5 py-2 font-hand text-xl whitespace-nowrap shadow-lift md:bottom-8"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          You found the {label} sticker!
        </m.p>
      )}
    </AnimatePresence>
  )
}

/** Header button showing the count; opens the sticker book. */
export function StickerBookButton() {
  const earned = useStickers()
  const dialog = useRef<HTMLDialogElement>(null)
  const all = earned.length === stickers.length
  if (!siteConfig.stickerBook) return null
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Sticker book: ${earned.length} of ${stickers.length} stickers`}
        className={cn(
          'stamp flex min-h-11 items-center gap-1.5 rounded-full border border-sage-100 px-3 text-small font-bold text-forest hover:bg-mist',
          all && 'border-brass bg-hindi-tint',
        )}
      >
        <Sparkles aria-hidden size={18} className={all ? 'text-brass' : 'text-sage'} />
        {earned.length}/{stickers.length}
      </button>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        aria-label="Your sticker book"
        className="m-auto w-[min(92vw,26rem)] bg-cream p-6 shadow-lift backdrop:bg-evergreen/70"
      >
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full hover:bg-mist"
        >
          <X aria-hidden />
        </button>
        <p className="eyebrow">Sticker book</p>
        <h2 className="text-h3">
          {all ? 'Bookworm!' : `${earned.length} of ${stickers.length} stickers`}
        </h2>
        <p className="mt-2 text-small">Visit every page of the book to collect them all.</p>
        <ul className="mt-5 grid grid-cols-3 gap-4">
          {stickers.map((s) => (
            <li key={s.id} className="flex flex-col items-center gap-1 text-small">
              <Sticker id={s.id} earned={earned.includes(s.id)} />
              {s.label}
            </li>
          ))}
        </ul>
        {all && (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-hindi-tint p-4">
            <Elu pose="cheer" label="Elu cheering" className="w-16" />
            <p className="font-hand text-2xl">Bookworm badge earned!</p>
          </div>
        )}
      </dialog>
    </>
  )
}
