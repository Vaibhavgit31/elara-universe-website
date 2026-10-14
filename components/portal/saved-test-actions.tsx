'use client'

import { Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteTest, duplicateTest } from '@/app/web-support/test-maker/actions'

const action =
  'focus-glow inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-small font-semibold text-forest hover:bg-mint'

/** Duplicate, and Delete with a second "Delete for good" step so a slip loses nothing. */
export function SavedTestActions({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div className="flex flex-wrap gap-1">
      <form action={duplicateTest}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={action} aria-label={`Duplicate ${title}`}>
          <Copy aria-hidden size={16} /> Duplicate
        </button>
      </form>
      {confirming ? (
        <form action={deleteTest} className="flex gap-1">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className={`${action} font-bold text-evergreen`}>
            <Trash2 aria-hidden size={16} /> Delete for good
          </button>
          <button type="button" className={action} onClick={() => setConfirming(false)}>
            Keep it
          </button>
        </form>
      ) : (
        <button
          type="button"
          className={action}
          aria-label={`Delete ${title}`}
          onClick={() => setConfirming(true)}
        >
          <Trash2 aria-hidden size={16} /> Delete
        </button>
      )}
    </div>
  )
}
