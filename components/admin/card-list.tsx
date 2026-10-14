import type { ReactNode } from 'react'

/** A two-column list of glass cards, or the empty-state line when there is nothing to show. */
export function CardList<T extends { id: string }>({
  items,
  empty,
  render,
}: {
  items: T[]
  empty: string
  render: (item: T) => ReactNode
}) {
  if (!items.length) return <p className="mt-8 text-forest">{empty}</p>
  return (
    <ul className="mt-8 grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>{render(item)}</li>
      ))}
    </ul>
  )
}
