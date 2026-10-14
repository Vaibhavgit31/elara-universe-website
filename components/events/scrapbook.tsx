'use client'

import { m } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Pencil } from '@/components/classroom/pencil'
import { SampleSticker } from '@/components/events/event-ticket'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { WashiTape } from '@/components/ui/washi-tape'
import type { Event } from '@/content/events'
import { formatDate } from '@/lib/events'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** One polaroid: washi tape, the photo as a button that opens the lightbox, a hand-written caption. */
const Polaroid = ({ event, onOpen }: { event: Event; onOpen: () => void }) => (
  <figure className="relative lift-corner bg-paper p-3 pb-4 shadow-lift">
    <WashiTape className="rotate-3" />
    {event.isPlaceholder && <SampleSticker className="absolute top-4 right-4 z-10" />}
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${event.title}`}
      className="block aspect-4/3 w-full overflow-hidden bg-mist"
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
)

/** Past events as polaroids that drop onto a glass panel, with a lightbox for the photos. */
export function Scrapbook({ events }: { events: Event[] }) {
  const active = useFlipPageActive()
  const reduced = useReducedMotion()
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<Event | null>(null)
  const show = (event: Event) => {
    setOpen(event)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()
  // Before the page is read the polaroids wait above it; with reduced motion they only fade.
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: -40, rotate: -8 }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow="Scrapbook" title="Past" accent="events" crayon="drawing" />
          <Pencil className="mt-8 w-48 max-w-full" tilt={-6} />
        </div>
        <Glass radius="lg" className="p-6 md:p-8">
          <ul className="grid gap-8 sm:grid-cols-2">
            {events.map((event, i) => (
              <m.li
                key={event.slug}
                initial={false}
                animate={active ? { opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 } : hidden}
                transition={{ duration: reduced ? 0.4 : 0.6, delay: reduced ? 0 : i * 0.15 }}
              >
                <Polaroid event={event} onOpen={() => show(event)} />
              </m.li>
            ))}
          </ul>
        </Glass>
      </div>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === e.currentTarget && close()}
        onClose={() => setOpen(null)}
        aria-label={open?.title}
        className="m-auto w-[min(92vw,56rem)] border-0 bg-transparent p-0 backdrop:bg-evergreen/70"
      >
        {open && (
          <Glass radius="lg" spotlight={false} className="p-4 pt-16 sm:p-6 sm:pt-16">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-forest hover:bg-sage-100"
            >
              <X aria-hidden />
            </button>
            {open.image && (
              <Image
                src={open.image}
                alt={open.title}
                width={1200}
                height={900}
                className="w-full rounded-md"
              />
            )}
            <p className="mt-4 font-hand text-2xl">
              {open.title}
              <span className="block text-lg text-forest">
                {formatDate(open.date)} · {open.city} · {open.venue}
              </span>
            </p>
          </Glass>
        )}
      </dialog>
    </>
  )
}
