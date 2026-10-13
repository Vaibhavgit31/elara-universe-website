'use client'

import { usePathname, useRouter } from 'next/navigation'
import { m, useReducedMotion } from 'framer-motion'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { easeOut } from '@/components/motion/motion-provider'

type Turn = { navigate: (href: string) => void; leaving: boolean; turned: boolean }
const TurnContext = createContext<Turn | null>(null)

/** Navigate with a page turn: the current page lifts away, then the new one is revealed. */
export const usePageTurn = () => useContext(TurnContext)?.navigate

/** Holds the turn state for the whole frame (menu, page and footer links). */
export function PageTurnProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const reduced = useReducedMotion()
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null)

  const navigate = (href: string) => {
    setLeavingFrom(pathname)
    setTimeout(() => router.push(href), reduced ? 150 : 360)
  }

  return (
    <TurnContext
      value={{ navigate, leaving: leavingFrom === pathname, turned: leavingFrom !== null }}
    >
      {children}
    </TurnContext>
  )
}

/** Wraps the page content: lifts and turns away on leave, settles in on arrival. The page
 *  loaded first is shown at once, so nothing waits for JavaScript. */
export function PageTurn({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { leaving = false, turned = false } = useContext(TurnContext) ?? {}
  return (
    <div className="flex flex-1 flex-col overflow-x-clip" style={{ perspective: '1600px' }}>
      <m.div
        key={pathname}
        data-testid="page"
        className="flex flex-1 flex-col"
        style={{ transformOrigin: 'top center' }}
        initial={turned ? { opacity: 0, rotateX: 8, y: 24 } : false}
        animate={leaving ? { opacity: 0, rotateX: -75, y: -40 } : { opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: leaving ? 0.36 : 0.3, ease: easeOut }}
      >
        {children}
      </m.div>
    </div>
  )
}
