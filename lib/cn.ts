import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge our custom font-size tokens so `text-h2` never collides with `text-forest`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: { 'font-size': [{ text: ['body', 'small', 'label', 'h1', 'h2', 'h3'] }] },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
