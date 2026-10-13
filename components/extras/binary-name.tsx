'use client'

import { useState } from 'react'

/** Type your name and see it the way a computer stores it: as 0s and 1s. */
export default function BinaryName() {
  const [name, setName] = useState('')
  const letters = [...name].slice(0, 12)
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="eyebrow">Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          autoComplete="given-name"
          className="mt-1 block w-full border-0 border-b-2 border-sage bg-transparent px-1 py-2 text-body focus:border-forest focus:outline-none"
          placeholder="Type here"
        />
      </label>
      {letters.length > 0 && (
        <ol className="space-y-1 font-mono text-small" aria-live="polite">
          {letters.map((ch, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-6 text-center font-heading text-lg">{ch === ' ' ? '␣' : ch}</span>
              <span className="flex gap-0.5">
                {ch
                  .codePointAt(0)!
                  .toString(2)
                  .padStart(8, '0')
                  .split('')
                  .map((bit, j) => (
                    <span
                      key={j}
                      className={
                        bit === '1'
                          ? 'size-5 rounded-sm bg-computer text-center text-cream'
                          : 'size-5 rounded-sm bg-computer-tint text-center text-forest'
                      }
                    >
                      {bit}
                    </span>
                  ))}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="text-small text-forest">
        Every letter has a number, and the computer writes that number with eight 0s and 1s.
      </p>
    </div>
  )
}
