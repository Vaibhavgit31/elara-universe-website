import type { ReactNode } from 'react'

export type FlipPageProps = {
  children: ReactNode
  /** Extra classes for the sheet, e.g. a different paper colour */
  className?: string
  /** Render children edge to edge without the standard page padding */
  bare?: boolean
}

/**
 * What FlipPad receives: the rendered element's props across the server/client boundary
 * (`data-bare`), or the raw FlipPage props inside a client tree (`bare`).
 */
export type FlipPageElementProps = FlipPageProps & { 'data-bare'?: boolean }

/**
 * One page of a <FlipPad>. It renders a plain element so its props survive the server/client
 * boundary; FlipPad reads those props and draws the sheet itself.
 */
export const FlipPage = ({ children, className, bare }: FlipPageProps) => (
  <div className={className} data-bare={bare}>
    {children}
  </div>
)
