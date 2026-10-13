import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/** False while the server HTML is being hydrated, then true. Lets a first paint show the final
 *  state before any animation starts. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
