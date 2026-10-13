import { useSyncExternalStore } from 'react'
import { isoToday } from '@/lib/events'

const noop = () => () => {}

/**
 * Today's date as an ISO string. The build date is used while the static HTML hydrates, then the
 * visitor's real date takes over, so events move from upcoming to past without a rebuild.
 */
export const useToday = (buildDate: string) =>
  useSyncExternalStore(
    noop,
    () => isoToday(),
    () => buildDate,
  )
