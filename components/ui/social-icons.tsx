import type { SVGProps } from 'react'

// lucide-react no longer ships brand icons, so these four are drawn here.
const icon = (path: string) =>
  function SocialIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...props}
      >
        <path d={path} />
      </svg>
    )
  }

export const socialIcons = {
  Instagram: icon(
    'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.2-1.2h.01',
  ),
  Facebook: icon(
    'M14 21v-7h2.5l.5-3h-3V9.2c0-.9.3-1.5 1.6-1.5H17V5.1C16.7 5 15.8 5 14.9 5 12.7 5 11 6.3 11 8.8V11H8.5v3H11v7',
  ),
  YouTube: icon(
    'M3.5 8.2A2.6 2.6 0 0 1 5.3 6c1.7-.4 5-.5 6.7-.5s5 .1 6.7.5a2.6 2.6 0 0 1 1.8 2.2c.3 1.5.3 2.8.3 3.8s0 2.3-.3 3.8a2.6 2.6 0 0 1-1.8 2.2c-1.7.4-5 .5-6.7.5s-5-.1-6.7-.5a2.6 2.6 0 0 1-1.8-2.2C3.2 14.3 3.2 13 3.2 12s0-2.3.3-3.8ZM10 9.5v5l4.5-2.5L10 9.5Z',
  ),
  LinkedIn: icon(
    'M6.5 9.5v8M6.5 6.2v.01M11 17.5v-8m0 3.5c0-2 1.5-3.5 3.3-3.5 1.9 0 3.2 1.4 3.2 3.4v4.6',
  ),
}
