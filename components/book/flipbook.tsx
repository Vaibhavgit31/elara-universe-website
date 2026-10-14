'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useInView } from 'framer-motion'
import { useRef, useState, type KeyboardEvent } from 'react'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { BookLoader } from '@/components/ui/book-loader'
import { cn } from '@/lib/cn'
import { SoundToggle } from '@/components/ui/sound-toggle'
import { playFlipSound, useFlipSound } from '@/lib/flip-sound'

// react-pageflip draws on the DOM, so it is loaded in the browser only.
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false })

type Props = {
  pages: string[]
  /** e.g. "Basic Hindi Reader Class 1" — used for alt text */
  title: string
  /** Page width ÷ height. Hindi Reader pages are US Letter: 612 × 792 pt. */
  ratio?: number
  className?: string
}

/**
 * Realistic page turns (react-pageflip): a two-page spread on wide screens, one page with swipe
 * on phones. Arrow keys and the buttons also turn pages. Page-turn sound is off by default.
 */
export function Flipbook({ pages, title, ratio = 612 / 792, className }: Props) {
  const book = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } }>(null)
  const box = useRef<HTMLDivElement>(null)
  // The book (and its sample images) load once the reader scrolls near it on a page being read,
  // and then stay mounted.
  const inView = useInView(box, { once: true, margin: '240px' })
  const active = useFlipPageActive()
  const [near, setNear] = useState(false)
  if (inView && active && !near) setNear(true)
  const [page, setPage] = useState(0)
  const sound = useFlipSound()
  const [ready, setReady] = useState(false)
  const width = 360
  const height = Math.round(width / ratio)
  const flip = (dir: 'next' | 'prev') =>
    book.current?.pageFlip()?.[dir === 'next' ? 'flipNext' : 'flipPrev']()
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') flip('next')
    if (e.key === 'ArrowLeft') flip('prev')
  }
  const control =
    'flex size-11 items-center justify-center rounded-full bg-forest text-cream hover:bg-evergreen'

  return (
    <div
      className={cn('mx-auto w-full max-w-3xl', className)}
      data-testid="flipbook"
      data-ready={ready}
    >
      <div
        ref={box}
        role="group"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${title} sample pages. Use the arrow keys to turn pages.`}
        className="relative mx-auto rounded-sm"
        style={{ maxWidth: 2 * 420, aspectRatio: `${2 * ratio}` }}
        data-near={near}
      >
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookLoader label="Loading sample pages" />
          </div>
        )}
        {near && (
          <HTMLFlipBook
            ref={book}
            className="mx-auto"
            style={{}}
            width={width}
            height={height}
            size="stretch"
            minWidth={200}
            maxWidth={420}
            minHeight={Math.round(200 / ratio)}
            maxHeight={Math.round(420 / ratio)}
            startPage={0}
            drawShadow
            flippingTime={700}
            usePortrait
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.4}
            showCover={false}
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            onInit={() => setReady(true)}
            onFlip={(e: { data: number }) => setPage(e.data)}
            onChangeState={(e: { data: string }) => {
              if (e.data === 'flipping' && sound) playFlipSound()
            }}
          >
            {pages.map((src, i) => (
              <div key={src} className="overflow-hidden bg-paper shadow-page">
                <Image
                  src={src}
                  alt={`${title}, sample page ${i + 1}`}
                  width={612}
                  height={792}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </HTMLFlipBook>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => flip('prev')}
          aria-label="Previous page"
          className={control}
        >
          <ChevronLeft aria-hidden />
        </button>
        <p className="min-w-16 text-center font-hand text-xl text-forest" aria-live="polite">
          {page + 1} / {pages.length}
        </p>
        <button
          type="button"
          onClick={() => flip('next')}
          aria-label="Next page"
          className={control}
        >
          <ChevronRight aria-hidden />
        </button>
        <SoundToggle className="ml-2" />
      </div>
    </div>
  )
}
