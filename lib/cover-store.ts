import { useSyncExternalStore } from 'react'

// Whether the home page's book cover has opened. Lets the hero start its ink animation at the
// right moment without prop drilling.
let open = false
const listeners = new Set<() => void>()
export const openCover = () => {
  open = true
  listeners.forEach((l) => l())
}
export const useCoverOpen = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => open,
    () => false,
  )
