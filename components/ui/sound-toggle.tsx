'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { setFlipSound, useFlipSound } from '@/lib/flip-sound'

/** Speaker button for the page-turn sound: off by default, the choice is remembered. */
export function SoundToggle({ className }: { className?: string }) {
  const on = useFlipSound()
  return (
    <button
      type="button"
      onClick={() => setFlipSound(!on)}
      aria-pressed={on}
      aria-label="Page-turn sound"
      title={on ? 'Page-turn sound on' : 'Page-turn sound off'}
      className={cn(
        'flex size-11 items-center justify-center rounded-full',
        on ? 'bg-forest text-cream hover:bg-evergreen' : 'bg-sage-100 text-forest hover:bg-sage',
        className,
      )}
    >
      {on ? <Volume2 aria-hidden size={20} /> : <VolumeX aria-hidden size={20} />}
    </button>
  )
}
