'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { easeOut } from '@/components/motion/motion-provider'
import { site } from '@/content/site'

// The closed book on the home page. Opens on tap, on the first scroll, or after 1.5 seconds.
export function OpeningCover() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const openBook = () => setOpen(true)
    const timer = setTimeout(openBook, 1500)
    const events = ['scroll', 'wheel', 'touchmove'] as const
    for (const name of events)
      window.addEventListener(name, openBook, { once: true, passive: true })
    return () => {
      clearTimeout(timer)
      for (const name of events) window.removeEventListener(name, openBook)
    }
  }, [])

  return (
    <div className="contents" data-cover={open ? 'open' : 'closed'}>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            aria-label="Open the book"
            onClick={() => setOpen(true)}
            className="absolute inset-0 z-20 flex origin-left flex-col items-center justify-center bg-cream shadow-lift"
            initial={false}
            exit={{ rotateY: -110, opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: easeOut,
              opacity: { delay: reduced ? 0 : 0.55, duration: 0.35 },
            }}
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-sage-100 md:w-5" />
            <span
              aria-hidden
              className="absolute inset-4 rounded-sm border border-brass/50 md:inset-8"
            />
            <Image
              src="/brand/logo-full.svg"
              alt={site.name}
              width={1204}
              height={672}
              priority
              className="w-64 sm:w-80 lg:w-96"
            />
            <span className="mt-10 font-hand text-2xl text-forest">tap to open</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
