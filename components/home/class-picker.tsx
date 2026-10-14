'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { m } from 'framer-motion'
import { useRef, useState } from 'react'
import { CoverPlaceholder, coverBoxClass } from '@/components/book/cover-placeholder'
import { Flipbook } from '@/components/book/flipbook'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { books, formatMrp, type Book } from '@/content/books'
import { series } from '@/content/series'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const classes = [1, 2, 3, 4, 5, 6, 7, 8]
/** out: the old cover turns edge-on; in: the new one turns back; idle: nothing moves. */
type Phase = 'idle' | 'out' | 'in'

/** The cover artwork, or the illustrated placeholder while it is on its way. */
const Cover = ({ book }: { book: Book }) =>
  book.cover ? (
    <Image
      src={book.cover}
      alt={`${book.title} cover`}
      width={309}
      height={400}
      className="h-full w-full object-cover"
    />
  ) : (
    <CoverPlaceholder series={book.series} cls={book.class} subject={book.subject} />
  )

/** Eight class pills, the picked cover on a tilting glass card with its price when known, and a
 *  "Peek inside" dialog that holds the sample flipbook. */
export function ClassPicker({ seriesId }: { seriesId: string }) {
  const s = series.find((x) => x.id === seriesId) ?? series[0]
  const shelf = books.filter((b) => b.series === s.name)
  const bookFor = (cls: number) => shelf.find((b) => b.class === cls) ?? shelf[0]
  const reduced = useReducedMotion()
  const [picked, setPicked] = useState(1)
  const [shown, setShown] = useState(1)
  const [phase, setPhase] = useState<Phase>('idle')
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const book = bookFor(picked)

  const pick = (cls: number) => {
    if (cls === picked) return
    setPicked(cls)
    if (reduced) setShown(cls)
    else setPhase('out')
  }
  // Edge-on, the old cover is swapped for the picked one before it turns back.
  const onFlipped = () => {
    if (phase === 'out') setShown(picked)
    setPhase(phase === 'out' ? 'in' : 'idle')
  }
  const show = () => {
    setOpen(true)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()

  return (
    <div className="flex w-full max-w-md flex-col gap-6" data-testid="class-picker">
      <div role="group" aria-label="Choose a class" className="flex flex-wrap gap-2">
        {classes.map((cls) => (
          <button
            key={cls}
            type="button"
            aria-pressed={cls === picked}
            onClick={() => pick(cls)}
            className={cn(
              'focus-glow stamp flex size-11 items-center justify-center rounded-full font-heading text-lg font-bold transition-colors duration-200',
              cls === picked ? 'bg-leaf-700 text-white' : 'glass text-forest hover:bg-white/70',
            )}
          >
            {cls}
          </button>
        ))}
      </div>
      <Glass tilt className="w-full max-w-xs p-4">
        <div style={{ perspective: '1000px' }}>
          <m.div
            className={cn('origin-left', coverBoxClass)}
            initial={false}
            animate={{ rotateY: phase === 'out' ? -90 : 0 }}
            transition={{ duration: 0.25, ease: phase === 'out' ? 'easeIn' : 'easeOut' }}
            onAnimationComplete={onFlipped}
            data-testid="class-cover"
          >
            <Cover book={bookFor(shown)} />
          </m.div>
        </div>
        <p className="mt-4 font-heading font-semibold text-evergreen" aria-live="polite">
          {s.name} · Class {picked}
          {book.mrp && (
            <span className="block text-small font-bold text-forest">{formatMrp(book.mrp)}</span>
          )}
        </p>
      </Glass>
      <div className="flex flex-wrap gap-4">
        <Button variant="brass" onClick={show} aria-haspopup="dialog">
          Peek inside
        </Button>
        <Button href={`/contact?book=${book.slug}`} variant="secondary">
          Request a sample copy
        </Button>
      </div>
      <dialog
        ref={dialog}
        aria-label={`Peek inside ${book.title}`}
        onClick={(e) => e.target === e.currentTarget && close()}
        onClose={() => setOpen(false)}
        className="m-auto w-[min(92vw,56rem)] border-0 bg-transparent p-0 backdrop:bg-evergreen/60"
      >
        {open && (
          <Glass radius="lg" spotlight={false} className="p-4 pt-16 sm:p-8 sm:pt-16">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-forest hover:bg-sage-100"
            >
              <X aria-hidden />
            </button>
            <p className="eyebrow">
              {s.name} · Class {picked}
            </p>
            {book.samples.length ? (
              <Flipbook pages={book.samples} title={book.title} className="mt-4" />
            ) : (
              <div className="mt-4 flex flex-col items-center gap-4">
                <div className={cn('w-full max-w-xs', coverBoxClass)}>
                  <Cover book={book} />
                </div>
                <p className="font-hand text-2xl text-forest">Sample pages coming soon.</p>
              </div>
            )}
          </Glass>
        )}
      </dialog>
    </div>
  )
}
