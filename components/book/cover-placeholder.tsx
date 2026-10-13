import { subjectLabel, type Subject } from '@/content/series'
import { cn } from '@/lib/cn'

const tints = {
  hindi: 'bg-hindi-tint text-gold-ink',
  computer: 'bg-computer-tint text-computer',
  drawing: 'bg-drawing-tint text-drawing',
}

/** Fixed-ratio cover box so every book on a shelf stands the same height. */
export const coverBoxClass = 'aspect-[309/400] min-h-0 overflow-hidden rounded-r-sm shadow-lift'

/** Stands in for a cover whose artwork has not arrived yet. Fills its parent's cover box. */
export function CoverPlaceholder({
  series,
  cls,
  subject,
  className,
}: {
  series: string
  cls: number
  subject: Subject
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={`${series} Class ${cls} cover coming soon`}
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden p-3 text-center leading-tight',
        tints[subject],
        className,
      )}
    >
      <span className="font-heading text-xs font-bold sm:text-small">{series}</span>
      <span className="font-heading text-2xl font-bold sm:text-3xl">{cls}</span>
      <span className="text-[9px] font-bold tracking-widest uppercase">
        {subjectLabel[subject]}
      </span>
      <span className="font-hand text-sm sm:text-base">cover coming soon</span>
    </div>
  )
}
