'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { usePageTurn } from '@/components/frame/page-turn'

type Props = Omit<ComponentProps<typeof Link>, 'href' | 'onNavigate'> & { href: string }

/** Internal link that turns the page instead of jumping. External links keep using <a>. */
export function TurnLink({ href, ...props }: Props) {
  const turn = usePageTurn()
  return (
    <Link
      href={href}
      onNavigate={(e) => {
        if (!turn) return
        e.preventDefault()
        turn(href)
      }}
      {...props}
    />
  )
}
