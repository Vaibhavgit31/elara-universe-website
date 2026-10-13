import { MessageCircle } from 'lucide-react'
import { site, whatsappLink } from '@/content/site'

// Floating WhatsApp button: bottom right on desktop, above the bottom bar on phones.
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(`Hello ${site.shortName}, I would like to know more about your books.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-20 z-30 flex min-h-14 items-center gap-2 rounded-full bg-forest px-4 text-cream shadow-lift transition-transform hover:bg-evergreen active:scale-95 md:right-6 md:bottom-6"
    >
      <MessageCircle aria-hidden size={26} />
      <span className="hidden font-semibold md:inline">WhatsApp</span>
    </a>
  )
}
