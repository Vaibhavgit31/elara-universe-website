'use client'

import { useSyncExternalStore } from 'react'
import { PORTAL_HINT_COOKIE } from '@/lib/auth/config'

// The top bar only needs to know whether someone is signed in, so it reads the hint cookie set
// at sign-in (no secret in it; the real session is verified on the server). Server render says
// "signed out", the browser corrects it after hydration.
const subscribe = (notify: () => void) => {
  window.addEventListener('focus', notify)
  window.addEventListener('pageshow', notify)
  return () => {
    window.removeEventListener('focus', notify)
    window.removeEventListener('pageshow', notify)
  }
}
const read = () => document.cookie.split('; ').some((c) => c === `${PORTAL_HINT_COOKIE}=1`)

/** True once the visitor has signed in (teacher or admin). */
export const useSignedInHint = () => useSyncExternalStore(subscribe, read, () => false)
