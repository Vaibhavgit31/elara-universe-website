import type { Metadata } from 'next'
import { Caveat, Cormorant_Garamond, Lora, Noto_Sans_Devanagari, Nunito } from 'next/font/google'
import { site } from '@/content/site'
import './globals.css'

const lora = Lora({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-lora' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-cormorant',
})
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-caveat' })
const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-devanagari',
})

const fonts = [lora, cormorant, nunito, caveat, devanagari].map((f) => f.variable).join(' ')

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.shortName}` },
  description: site.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fonts} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
