'use client'

import { motion } from 'motion/react'
import { useFlipPageActive } from '@/components/flip/flip-pad'
import { useReducedMotion } from '@/lib/use-reduced-motion'

// How a book is made (PLAYBOOK: write and edit, illustrate, print, then add digital support).
// The one-line descriptions are [PLACEHOLDER] wording for Vaibhav to approve.
const steps = [
  {
    title: 'Write and edit',
    text: 'Lessons are written to NEP 2020 and NCF 2023, then edited for language and level.',
    paths: [
      'M30 92V34l12-12h40v70Z',
      'M42 22v12H30',
      'M44 48h20M44 60h20M44 72h12',
      'M78 86l14-30 6 2-14 30-8 4z',
    ],
  },
  {
    title: 'Illustrate',
    text: 'Artists draw the characters, pages and activities.',
    paths: [
      'M34 72c-10-28 14-50 40-46 22 4 30 22 22 34-6 8-18 4-18 14 0 8 8 14-6 16-18 2-32-6-38-18Z',
      'M48 50h.1M66 42h.1M80 56h.1',
      'M86 24l8-8 10 10-30 30-8 2 2-8Z',
    ],
  },
  {
    title: 'Print',
    text: 'The books are printed and bound for the classroom.',
    paths: [
      'M24 56h72v30H24Z',
      'M36 56V30h48v26',
      'M44 40h32M44 48h20',
      'M36 86v10h48V86',
      'M82 68h6',
    ],
  },
  {
    title: 'Add digital support',
    text: 'Videos, worksheets, quizzes and e-books are linked from the QR code in each book.',
    paths: [
      'M42 16h36a6 6 0 0 1 6 6v76a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6Z',
      'M54 94h12',
      'M54 48l16 10-16 10Z',
      'M46 30h8v8h-8ZM66 30h8v8h-8ZM46 70h8v8h-8Z',
    ],
  },
]

/** Four illustrated steps whose line drawings draw themselves in when the page is read. */
export function MakingSteps() {
  const active = useFlipPageActive()
  const reduced = useReducedMotion()
  return (
    <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title}>
          <svg
            viewBox="0 0 120 120"
            className="h-28 w-28 text-forest"
            aria-hidden
            data-testid="step-drawing"
          >
            {step.paths.map((d, j) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{
                  duration: reduced ? 0.4 : 1,
                  delay: reduced ? 0 : i * 0.35 + j * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>
          <p className="mt-2 eyebrow">Step {i + 1}</p>
          <h3>{step.title}</h3>
          <p className="mt-2 text-small">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
