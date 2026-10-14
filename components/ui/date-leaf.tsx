import { monthShort } from '@/lib/events'

/** A tear-off calendar leaf: the day in big type over the short month, and the year if asked.
 *  Renders a <time> so the date stays machine-readable; pass `aria-hidden` through `decorative`
 *  when the full date is printed next to it. */
export function DateLeaf({
  date,
  year = false,
  decorative = false,
}: {
  date: string
  year?: boolean
  decorative?: boolean
}) {
  return (
    <time
      dateTime={date}
      aria-hidden={decorative || undefined}
      className="flex w-14 shrink-0 flex-col items-center rounded-sm bg-mist py-2 shadow-page"
    >
      <span className="font-heading text-h3 leading-none font-bold text-forest">
        {Number(date.slice(8))}
      </span>
      <span className="mt-1 eyebrow">{monthShort(date)}</span>
      {year && <span className="text-small text-forest">{date.slice(0, 4)}</span>}
    </time>
  )
}
