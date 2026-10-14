'use client'

import { Chalkboard, ChalkLine, ChalkText } from '@/components/classroom/chalkboard'
import { useFlipPageActive } from '@/components/flip/flip-pad'

/** A chapter opener on the classroom board: the chapter number, the title written in chalk once
 *  its page is the one being read, a chalk line and an optional note. */
export function ChapterBoard({
  number,
  title,
  note,
  className,
}: {
  number: number
  title: string
  note?: string
  className?: string
}) {
  const active = useFlipPageActive()
  return (
    <Chalkboard className={className}>
      <ChalkText as="p" text={`Chapter ${number}`} className="text-xl" />
      <ChalkText as="h2" text={title} write start={active} className="mt-2 text-h1" />
      <ChalkLine className="mt-2" />
      {note && <ChalkText as="p" text={note} className="mt-6 max-w-prose text-2xl" />}
    </Chalkboard>
  )
}
