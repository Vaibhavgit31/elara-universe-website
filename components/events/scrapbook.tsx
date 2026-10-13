'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { WashiTape } from '@/components/ui/washi-tape'
import type { Event } from '@/content/events'
import { formatDate } from '@/lib/events'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** Past events as polaroids that drop onto the page, with a lightbox for the photos. */
export function Scrapbook({ events }: { events: Event[] }) {
  const active = useFlipPageActive()
  const reduced = useReducedMotion()
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<Event | null>(null)
  const show = (event: Event) => {
    setOpen(event)
    dialog.current?.showModal()
  }

  return (
    <>
      <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <motion.li
            key={event.slug}
            className="relative"
            initial={false}
            animate={
              active
                ? { opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }
                : { opacity: 0, y: -40, rotate: -8 }
            }
            transition={{ duration: reduced ? 0.4 : 0.6, delay: reduced ? 0 : i * 0.15 }}
          >
            <figure className="relative bg-paper p-3 pb-4 shadow-lift">
              <WashiTape className="rotate-3" />
              {event.isPlaceholder && (
                <span className="absolute top-5 right-5 z-10 rotate-6 rounded-sm bg-drawing px-2 py-0.5 text-label text-cream uppercase">
                  Sample
                </span>
              )}
              <button
                type="button"
                onClick={() => show(event)}
                aria-label={`Open photo: ${event.title}`}
                className="block aspect-[4/3] w-full overflow-hidden bg-mist"
              >
                {event.image && (
                  <Image
                    src={event.image}
                    alt=""
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
              <figcaption className="mt-3 font-hand text-xl leading-tight">
                {event.title}
                <span className="block text-base text-forest">
                  {formatDate(event.date)} · {event.city}
                </span>
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onClose={() => setOpen(null)}
        aria-label={open?.title}
        className="m-auto w-[min(92vw,56rem)] bg-paper p-3 shadow-lift backdrop:bg-evergreen/70"
      >
        {open && (
          <div className="relative">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full bg-paper/90 text-evergreen"
            >
              <X aria-hidden />
            </button>
            {open.image && (
              <Image
                src={open.image}
                alt={open.title}
                width={1200}
                height={900}
                className="w-full"
              />
            )}
            <p className="p-4 font-hand text-2xl">
              {open.title}
              <span className="block text-lg text-forest">
                {formatDate(open.date)} · {open.city} · {open.venue}
              </span>
            </p>
          </div>
        )}
      </dialog>
    </>
  )
}
