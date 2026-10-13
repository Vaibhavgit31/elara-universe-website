'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

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
 * on phones. Arrow keys and the buttons also turn pages.
 */
export function Flipbook({ pages, title, ratio = 612 / 792, className }: Props) {
  const book = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } }>(null)
  const [page, setPage] = useState(0)
  const width = 360
  const height = Math.round(width / ratio)
  const flip = (dir: 'next' | 'prev') =>
    book.current?.pageFlip()[dir === 'next' ? 'flipNext' : 'flipPrev']()
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') flip('next')
    if (e.key === 'ArrowLeft') flip('prev')
  }

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)} data-testid="flipbook">
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${title} sample pages. Use the arrow keys to turn pages.`}
        className="rounded"
      >
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
          onFlip={(e: { data: number }) => setPage(e.data)}
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
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => flip('prev')}
          aria-label="Previous page"
          className="flex size-11 items-center justify-center rounded-full bg-forest text-cream hover:bg-evergreen"
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
          className="flex size-11 items-center justify-center rounded-full bg-forest text-cream hover:bg-evergreen"
        >
          <ChevronRight aria-hidden />
        </button>
      </div>
    </div>
  )
}
