import { useSyncExternalStore } from 'react'

// Sticker book: one sticker per page, saved only in the visitor's own browser.
export const stickers = [
  { id: 'home', page: '/', label: 'Leaf', color: '#8A9A74' },
  { id: 'catalog', page: '/catalog', label: 'Book', color: '#3F5645' },
  { id: 'about', page: '/about', label: 'Star', color: '#B68235' },
  { id: 'events', page: '/events', label: 'Ticket', color: '#E07A5F' },
  { id: 'contact', page: '/contact', label: 'Pencil', color: '#E8A53A' },
  { id: 'resources', page: '/resources', label: 'QR door', color: '#4A90C2' },
] as const
export type StickerId = (typeof stickers)[number]['id']

const KEY = 'elara:stickers'
const listeners = new Set<() => void>()
let cache: StickerId[] | null = null

const read = (): StickerId[] => {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    cache = []
  }
  return cache!
}

export const stickerForPath = (pathname: string) =>
  stickers.find((s) => (s.page === '/' ? pathname === '/' : pathname.startsWith(s.page)))?.id

let justEarned: StickerId | null = null
const notify = () => listeners.forEach((l) => l())

/** Adds a sticker (works without saving if storage is blocked) and announces it for 3 seconds. */
export function earnSticker(id: StickerId) {
  const have = read()
  if (have.includes(id)) return
  cache = [...have, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {}
  justEarned = id
  notify()
  setTimeout(() => {
    justEarned = null
    notify()
  }, 3200)
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
/** The sticker earned a moment ago, or null. */
export const useJustEarned = () =>
  useSyncExternalStore(
    subscribe,
    () => justEarned,
    () => null,
  )

const empty: StickerId[] = []
export const useStickers = () => useSyncExternalStore(subscribe, read, () => empty)
