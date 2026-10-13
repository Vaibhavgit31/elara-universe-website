'use client'

import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import { playFlipSound } from '@/lib/flip-sound'

// react-pageflip draws on the DOM, so it is loaded in the browser only.
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false })

const SOUND_KEY = 'elara:flip-sound'
const readSoundPreference = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === 'on'
  } catch {
    return false
  }
}

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
  const [page, setPage] = useState(0)
  const [sound, setSound] = useState(false)
  const [ready, setReady] = useState(false)
  const width = 360
  const height = Math.round(width / ratio)
  const flip = (dir: 'next' | 'prev') =>
    book.current?.pageFlip()?.[dir === 'next' ? 'flipNext' : 'flipPrev']()
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') flip('next')
    if (e.key === 'ArrowLeft') flip('prev')
  }
  const toggleSound = () => {
    const next = !sound
    setSound(next)
    try {
      localStorage.setItem(SOUND_KEY, next ? 'on' : 'off')
    } catch {}
    if (next) playFlipSound()
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
          onInit={() => {
            setReady(true)
            setSound(readSoundPreference())
          }}
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
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label="Page-turn sound"
          title={sound ? 'Page-turn sound on' : 'Page-turn sound off'}
          className={cn(control, 'ml-2', !sound && 'bg-sage-100 text-forest hover:bg-sage')}
        >
          {sound ? <Volume2 aria-hidden /> : <VolumeX aria-hidden />}
        </button>
      </div>
    </div>
  )
}
