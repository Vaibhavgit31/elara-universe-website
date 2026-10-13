import type { Metadata } from 'next'
import { Caveat, Cormorant_Garamond, Lora, Noto_Sans_Devanagari, Nunito } from 'next/font/google'
import { BottomBar } from '@/components/frame/bottom-bar'
import { Footer } from '@/components/frame/footer'
import { Header } from '@/components/frame/header'
import { PageTurn, PageTurnProvider } from '@/components/frame/page-turn'
import { WhatsAppButton } from '@/components/frame/whatsapp-button'
import { MotionProvider } from '@/components/motion/motion-provider'
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
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <PageTurnProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brass focus:px-5 focus:py-3 focus:font-bold focus:text-evergreen"
            >
              Skip to content
            </a>
            <Header />
            <PageTurn>{children}</PageTurn>
            <Footer />
            <WhatsAppButton />
            <BottomBar />
          </PageTurnProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
