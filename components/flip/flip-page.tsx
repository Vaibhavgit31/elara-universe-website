import type { ReactNode } from 'react'

export type FlipPageProps = {
  children: ReactNode
  /** Extra classes for the sheet, e.g. a different paper colour */
  className?: string
  /** Render children edge to edge without the standard page padding */
  bare?: boolean
}

/** The rendered element's props, which is what FlipPad receives across the server/client boundary. */
export type FlipPageElementProps = {
  children: ReactNode
  className?: string
  'data-bare'?: boolean
}

/**
 * One page of a <FlipPad>. It renders a plain element so its props survive the server/client
 * boundary; FlipPad reads those props and draws the sheet itself.
 */
export const FlipPage = ({ children, className, bare }: FlipPageProps) => (
  <div className={className} data-bare={bare}>
    {children}
  </div>
)
