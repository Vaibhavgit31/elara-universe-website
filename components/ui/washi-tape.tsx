import { cn } from '@/lib/cn'

/** A strip of brass washi tape, by default across the top centre of its parent. */
export const WashiTape = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[repeating-linear-gradient(135deg,rgb(182_130_53/0.45)_0_6px,rgb(182_130_53/0.3)_6px_12px)]',
      className,
    )}
  />
)
