'use client'

import { useRef } from 'react'
import { OpeningCover } from '@/components/home/opening-cover'
import { Doodle } from '@/components/illustrations/doodles'
import { Elu } from '@/components/mascot/elu'
import { DriftingLeaves } from '@/components/motion/drifting-leaves'
import { InkText } from '@/components/motion/ink-text'
import { Button } from '@/components/ui/button'
import { site } from '@/content/site'
import { useCoverOpen } from '@/lib/cover-store'
import { useCrayonTrail } from '@/lib/use-crayon-trail'
import { useReducedMotion } from '@/lib/use-reduced-motion'

/** Home page 1: the closed cover, then the first spread with the ink headline and Elu. */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const open = useCoverOpen()
  const reduced = useReducedMotion()
  useCrayonTrail(ref, open && !reduced)
  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-4 pt-16 pb-24 sm:px-8"
      style={{ perspective: '1200px' }}
    >
      <DriftingLeaves />
      <OpeningCover />
      <Doodle kind="hindi" className="top-20 right-4 md:right-16" speed={0.1} />
      <Doodle kind="computer" className="bottom-28 left-4 md:left-16" speed={0.05} />
      <Doodle kind="drawing" className="right-8 bottom-24 hidden md:block" speed={0.14} />
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="eyebrow">{site.name}</p>
        {/* [PLACEHOLDER] headline suggested in PLAYBOOK.md */}
        <h1 className="mt-3 max-w-3xl font-display text-h1 font-medium">
          <InkText text="Books that grow curious minds." start={open} delay={0.2} />
        </h1>
        <p className="mt-5 max-w-2xl text-lg">{site.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/catalog">Explore the catalog</Button>
          <Button href="/contact" variant="secondary">
            Request a sample copy
          </Button>
        </div>
        <Elu
          pose="wave"
          label="Elu, the Elara Universe mascot, waving"
          className="absolute right-0 -bottom-16 hidden w-32 md:block lg:w-40"
        />
      </div>
    </section>
  )
}
