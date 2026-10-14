import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Row = { label: string; cells: ReactNode[] }

const cell = 'bg-cream/80 px-4 py-4 align-top'

/** A school-timetable grid: a real <table> with a caption, chalkboard column heads and row heads. */
export function Timetable({
  caption,
  columns,
  rows,
  className,
}: {
  caption: string
  columns: string[]
  rows: Row[]
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto rounded-md bg-sage-100 shadow-page', className)}>
      <table className="w-full min-w-xl border-separate border-spacing-px text-left">
        <caption className="bg-cream px-4 py-4 text-left font-heading text-h3 font-bold text-evergreen">
          {caption}
        </caption>
        <thead className="bg-chalkboard font-hand text-xl text-cream">
          <tr>
            <td className="px-4 py-2" />
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2 font-normal">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={cn(cell, 'font-heading font-bold text-forest')}>
                {row.label}
              </th>
              {row.cells.map((content, i) => (
                <td key={i} className={cell}>
                  {content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
