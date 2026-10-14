import { cn } from '@/lib/cn'

// Border and stamp colour per tone; 'leaf' is the default report-card look.
const tones = {
  leaf: 'border-forest fill-leaf-700',
  brass: 'border-brass fill-brass',
  computer: 'border-computer fill-computer',
  drawing: 'border-drawing fill-drawing',
  hindi: 'border-hindi fill-hindi',
}

/** A report-card style badge: a small label over a bold value, with a stamped tick in the corner. */
export function ReportBadge({
  label,
  value,
  tone = 'leaf',
  className,
}: {
  label: string
  value: string
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <dl
      className={cn(
        'relative inline-flex flex-col gap-1 rounded-sm border-2 bg-cream py-2 pr-10 pl-4 text-left',
        tones[tone],
        className,
      )}
    >
      <dt className="eyebrow">{label}</dt>
      <dd className="font-heading text-h3 font-bold text-evergreen">{value}</dd>
      <svg aria-hidden viewBox="0 0 24 24" className="absolute top-2 right-2 size-6 rotate-12">
        <circle cx="12" cy="12" r="11" />
        <path
          d="M7 12.5l3.2 3.2L17 9"
          fill="none"
          className="stroke-cream"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </dl>
  )
}
