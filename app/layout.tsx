import type { Metadata, Viewport } from 'next'
import { Caveat, Cormorant_Garamond, Lora, Noto_Sans_Devanagari, Nunito } from 'next/font/google'
import { BottomBar } from '@/components/frame/bottom-bar'
import { Footer } from '@/components/frame/footer'
import { Header } from '@/components/frame/header'
import { StickerCollector } from '@/components/extras/sticker-book'
import { HydrationMarker } from '@/components/frame/hydration-marker'
import { OrganizationJsonLd } from '@/components/frame/organization-jsonld'
import { PageTurn, PageTurnProvider } from '@/components/frame/page-turn'
import { SmoothScroll } from '@/components/frame/smooth-scroll'
import { WhatsAppButton } from '@/components/frame/whatsapp-button'
import { MotionProvider } from '@/components/motion/motion-provider'
import { site } from '@/content/site'
import 'lenis/dist/lenis.css'
import './globals.css'

const lora = Lora({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-lora' })
// The display and handwriting fonts are accents: fetched when first used, not preloaded, so the
// first paint waits only for the body and heading fonts.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-cormorant',
  preload: false,
})
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
})
const caveat = Caveat({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-caveat',
  preload: false,
})
const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '600'],
  variable: '--font-devanagari',
  preload: false,
})

const fonts = [lora, cormorant, nunito, caveat, devanagari].map((f) => f.variable).join(' ')

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.shortName}` },
  description: site.tagline,
  openGraph: { siteName: site.shortName, type: 'website', locale: 'en_IN' },
}

export const viewport: Viewport = { themeColor: '#3F5645' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fonts}>
      <head>
        <OrganizationJsonLd />
      </head>
      <body className="flex min-h-svh flex-col">
        <MotionProvider>
          <SmoothScroll>
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
              <HydrationMarker />
              <StickerCollector />
            </PageTurnProvider>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  )
}
