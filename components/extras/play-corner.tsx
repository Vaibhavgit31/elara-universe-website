'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookLoader } from '@/components/ui/book-loader'
import { Tag } from '@/components/ui/tag'
import type { Subject } from '@/content/series'

// Each activity is loaded only when a child opens it, so the home page stays light.
const loading = () => <BookLoader label="Loading activity" />
const activities = [
  {
    id: 'trace',
    subject: 'hindi' as Subject,
    title: 'Trace अ',
    text: 'Follow the letter with your finger.',
    Component: dynamic(() => import('@/components/extras/trace-letter'), { ssr: false, loading }),
  },
  {
    id: 'binary',
    subject: 'computer' as Subject,
    title: 'Your name in binary',
    text: 'See your name as 0s and 1s.',
    Component: dynamic(() => import('@/components/extras/binary-name'), { ssr: false, loading }),
  },
  {
    id: 'colour',
    subject: 'drawing' as Subject,
    title: 'Colour Elu',
    text: 'Pick a crayon and colour the mascot.',
    Component: dynamic(() => import('@/components/extras/colour-elu'), { ssr: false, loading }),
  },
]

export function PlayCorner() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <ul className="mt-8 grid gap-6 md:grid-cols-3">
      {activities.map(({ id, subject, title, text, Component }) => (
        <li key={id} className="rounded-xl bg-paper p-5 shadow-page" data-testid={`activity-${id}`}>
          <Tag tone={subject}>{title}</Tag>
          <p className="mt-3 text-small">{text}</p>
          {open === id ? (
            <div className="mt-4">
              <Component />
            </div>
          ) : (
            <Button variant="brass" className="mt-4" onClick={() => setOpen(id)}>
              Play
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
