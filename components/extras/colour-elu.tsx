'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const crayons = ['#E07A5F', '#4A90C2', '#E8A53A', '#8A9A74', '#B68235']
const base = {
  body: '#F5F0E8',
  cheeks: '#F5F0E8',
  feet: '#F5F0E8',
  pencil: '#F5F0E8',
  stem: '#F5F0E8',
}
type Part = keyof typeof base

/** Colour Elu in with a few crayons: tap a crayon, then tap a part. */
export default function ColourElu() {
  const [crayon, setCrayon] = useState(crayons[0])
  const [fills, setFills] = useState(base)
  const paint = (part: Part) => setFills({ ...fills, [part]: crayon })
  const region = (part: Part, d: string, label: string) => (
    <path
      d={d}
      fill={fills[part]}
      stroke="#3F5645"
      strokeWidth="3"
      strokeLinejoin="round"
      role="button"
      tabIndex={0}
      aria-label={`Colour the ${label}`}
      data-part={part}
      onClick={() => paint(part)}
      onKeyDown={(e) => e.key === 'Enter' && paint(part)}
      className="cursor-pointer focus:outline-none"
    />
  )
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 170 180" className="w-56 max-w-full" aria-label="Elu outline to colour in">
        {region(
          'feet',
          'M59 156a11 5 0 1 0 22 0a11 5 0 1 0-22 0ZM89 156a11 5 0 1 0 22 0a11 5 0 1 0-22 0Z',
          'feet',
        )}
        {region('body', 'M85 18C44 40 34 108 85 152C136 108 126 40 85 18Z', 'body')}
        {region('stem', 'M85 18c6-10 14-12 20-8l-4 6c-4-2-9-1-12 4z', 'stem')}
        {region(
          'cheeks',
          'M57 94a5 5 0 1 0 10 0a5 5 0 1 0-10 0ZM103 94a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z',
          'cheeks',
        )}
        <circle cx="70" cy="78" r="7" fill="#FBF9F4" stroke="#3F5645" strokeWidth="2" />
        <circle cx="100" cy="78" r="7" fill="#FBF9F4" stroke="#3F5645" strokeWidth="2" />
        <circle cx="70" cy="79" r="3.5" fill="#1B241D" />
        <circle cx="100" cy="79" r="3.5" fill="#1B241D" />
        <path
          d="M74 102q11 9 22 0"
          fill="none"
          stroke="#1B241D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M122 98C136 106 140 120 136 132"
          fill="none"
          stroke="#3F5645"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {region('pencil', 'M128 108l14-8 10 18-14 8z', 'pencil')}
      </svg>
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="radiogroup"
        aria-label="Crayon colour"
      >
        {crayons.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={crayon === c}
            aria-label={`Crayon ${c}`}
            onClick={() => setCrayon(c)}
            className="size-11 rounded-full border-4"
            style={{ background: c, borderColor: crayon === c ? '#1B241D' : 'transparent' }}
          />
        ))}
        <Button variant="ghost" onClick={() => setFills(base)}>
          Reset
        </Button>
      </div>
    </div>
  )
}
