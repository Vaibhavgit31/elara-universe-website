'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { markPaths, markViewBox } from '@/components/brand/mark-paths'
import { easeOut } from '@/components/motion/motion-provider'
import { site } from '@/content/site'
import { openCover } from '@/lib/cover-store'
import { useReducedMotion } from '@/lib/use-reduced-motion'

const INTRO_KEY = 'elara:intro-seen'
const noop = () => () => {}
const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return true
  }
}

/**
 * The closed book on the home page. On the first visit of a session the logo's lotus leaves
 * unfold one by one (about 1.5 s, with a Skip button); then the cover opens. It also opens on tap,
 * on the first scroll, or by itself. Later visits show the logo at once.
 */
export function OpeningCover() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  // false while hydrating, so the server HTML and first paint agree; then the real answer.
  const playIntro = useSyncExternalStore(
    noop,
    () => !introSeen(),
    () => false,
  )
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

  useEffect(() => {
    if (!hydrated) return
    const openBook = () => setOpen(true)
    const timer = setTimeout(openBook, playIntro ? 1500 + 900 : 1500)
    const events = ['scroll', 'wheel', 'touchmove'] as const
    for (const name of events)
      window.addEventListener(name, openBook, { once: true, passive: true })
    return () => {
      clearTimeout(timer)
      for (const name of events) window.removeEventListener(name, openBook)
    }
  }, [hydrated, playIntro])

  useEffect(() => {
    if (!open) return
    openCover()
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {}
  }, [open])

  // Leaves unfold from their base one after another; the book and wordmark follow.
  const leafDelay = (i: number) => (reduced || !playIntro ? 0 : i < 7 ? 0.1 + i * 0.12 : 0.95)
  const shown = hydrated

  return (
    <div className="contents" data-cover={open ? 'open' : 'closed'}>
      <AnimatePresence>
        {!open && (
          <motion.div
            className="absolute inset-0 z-20 flex origin-left cursor-pointer flex-col items-center justify-center bg-cream shadow-lift"
            onClick={() => setOpen(true)}
            initial={false}
            exit={{ rotateY: -110, opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: easeOut,
              opacity: { delay: reduced ? 0 : 0.55, duration: 0.35 },
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-sage-100 md:w-5"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-4 rounded-sm border border-brass/50 md:inset-8"
            />
            <button
              type="button"
              aria-label="Open the book"
              onClick={() => setOpen(true)}
              className="flex w-64 flex-col items-center sm:w-80 lg:w-96"
            >
              <svg viewBox={markViewBox} className="w-[45%]" aria-hidden>
                {markPaths.map((p, i) => (
                  <motion.path
                    key={i}
                    d={p.d}
                    fill={p.fill}
                    style={{
                      transformBox: 'fill-box',
                      originX: '50%',
                      originY: i < 7 ? '100%' : '50%',
                    }}
                    initial={false}
                    animate={
                      shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: i < 7 ? 0.1 : 1 }
                    }
                    transition={{
                      duration: reduced ? 0.5 : 0.5,
                      delay: leafDelay(i),
                      ease: easeOut,
                    }}
                  />
                ))}
              </svg>
              <motion.span
                initial={false}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={{ duration: 0.5, delay: reduced || !playIntro ? 0 : 1.1 }}
                className="mt-2 w-full"
              >
                <Image
                  src="/brand/wordmark.svg"
                  alt={site.name}
                  width={1016}
                  height={187}
                  priority
                  className="w-full"
                />
              </motion.span>
              <motion.span
                initial={false}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={{ delay: reduced || !playIntro ? 0 : 1.4 }}
                className="mt-10 font-hand text-2xl text-forest"
              >
                tap to open
              </motion.span>
            </button>
            {playIntro && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute top-6 right-6 min-h-11 rounded-full px-4 text-small font-bold text-forest underline decoration-brass underline-offset-4 md:top-10 md:right-10"
              >
                Skip intro
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
