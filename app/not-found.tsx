import type { Metadata } from 'next'
import { Main } from '@/components/frame/main'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Page not found' }

// An open book with one page torn out and drifting away.
const MissingPage = () => (
  <svg viewBox="0 0 320 200" className="mx-auto w-full max-w-sm" aria-hidden>
    <path
      d="M30 150c40-18 80-18 120 0V40c-40-18-80-18-120 0Z"
      fill="#F5F0E8"
      stroke="#3F5645"
      strokeWidth="3"
    />
    <path
      d="M150 150c40-18 80-18 120 0V40c-40-18-80-18-120 0Z"
      fill="#F5F0E8"
      stroke="#3F5645"
      strokeWidth="3"
    />
    <path d="M30 150c40-18 80-18 120 0 40-18 80-18 120 0v12H30Z" fill="#1B241D" />
    <path
      d="M52 62h76M52 80h76M52 98h76M52 116h60"
      stroke="#DCE5D2"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M166 70c20-6 40-10 60-6l-6 70c-20-6-40-6-60 0Z"
      fill="none"
      stroke="#8A9A74"
      strokeWidth="3"
      strokeDasharray="6 6"
    />
    <g transform="rotate(-14 240 50)">
      <rect
        x="208"
        y="14"
        width="64"
        height="76"
        rx="4"
        fill="#FBF9F4"
        stroke="#B68235"
        strokeWidth="3"
      />
      <path
        d="M220 32h40M220 46h40M220 60h28"
        stroke="#DCE5D2"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  </svg>
)

export default function NotFound() {
  return (
    <Main className="mx-auto w-full max-w-3xl items-center px-4 py-16 text-center sm:px-6">
      <div className="flex items-end justify-center gap-2">
        <Elu pose="search" label="Elu searching for the missing page" className="w-24 sm:w-32" />
        <MissingPage />
      </div>
      <p className="mt-8 eyebrow">Error 404</p>
      <h1>This page is missing from the book</h1>
      <p className="mt-3 max-w-md">
        The page you were looking for may have been torn out, moved, or never written. Let&apos;s
        turn back to a page that exists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/">Back to the cover</Button>
        <Button href="/catalog" variant="secondary">
          Browse the catalog
        </Button>
      </div>
    </Main>
  )
}
