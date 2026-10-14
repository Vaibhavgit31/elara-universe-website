import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge our custom tokens: `text-h2` never collides with `text-forest`, and
// `shadow-none` really removes `shadow-page` / `shadow-lift`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['body', 'small', 'label', 'h1', 'h2', 'h3'] }],
      shadow: [{ shadow: ['page', 'lift'] }],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
