import { MessageCircle } from 'lucide-react'
import { LazyMap } from '@/components/contact/lazy-map'
import { buttonClass } from '@/components/ui/button'
import { site, whatsappLink } from '@/content/site'

/** A postcard with both addresses, phone, email, WhatsApp and a map of the registered office. */
export function Postcard() {
  const [registered, office] = site.addresses
  return (
    <aside className="relative rotate-1 bg-paper p-6 shadow-lift sm:p-8" aria-label="Our addresses">
      <span
        aria-hidden
        className="absolute top-5 right-5 flex size-14 items-center justify-center border-2 border-dashed border-brass bg-hindi-tint font-hand text-xs text-gold-ink"
      >
        POST
      </span>
      <p className="eyebrow">Postcard</p>
      <h2 className="text-h3">Where to find us</h2>
      <dl className="mt-5 space-y-5 text-small">
        {[registered, office].map(({ label, lines }) => (
          <div key={label}>
            <dt className="eyebrow">{label}</dt>
            <dd className="mt-1">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </dd>
          </div>
        ))}
        <div>
          <dt className="eyebrow">Phone / WhatsApp</dt>
          <dd className="mt-1">
            <a className="link" href={`tel:${site.phoneE164}`}>
              {site.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Email</dt>
          <dd className="mt-1">
            <a className="break-words link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </dd>
        </div>
      </dl>
      <a
        href={whatsappLink(`Hello ${site.shortName}, I would like to know more about your books.`)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass('primary', 'mt-6')}
      >
        <MessageCircle aria-hidden size={20} /> Chat on WhatsApp
      </a>
      <div className="mt-6">
        <LazyMap
          query={`${registered.lines.join(', ')}, India`}
          title="Map of the registered office in Noida"
        />
      </div>
    </aside>
  )
}
