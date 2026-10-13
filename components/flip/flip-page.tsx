import type { ReactNode } from 'react'

export type FlipPageProps = { children: ReactNode; className?: string }

/**
 * One page of a <FlipPad>. It renders a plain element so its props survive the server/client
 * boundary; FlipPad reads those props and draws the sheet itself.
 */
export const FlipPage = ({ children, className }: FlipPageProps) => (
  <div className={className}>{children}</div>
)
