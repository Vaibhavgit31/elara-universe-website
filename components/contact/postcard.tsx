import { Mail, MessageCircle, Phone } from 'lucide-react'
import { LazyMap } from '@/components/contact/lazy-map'
import { buttonClass } from '@/components/ui/button-class'
import { Glass } from '@/components/ui/glass'
import { site, whatsappLink } from '@/content/site'
import { cn } from '@/lib/cn'

/** A "POST" stamp with a double brass border and the wavy lines of a postmark beside it. */
const PostStamp = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 96 56" className={cn('h-14 w-24', className)}>
    <rect
      x="2"
      y="2"
      width="52"
      height="52"
      rx="6"
      className="fill-cream stroke-brass"
      strokeWidth="3"
    />
    <rect
      x="9"
      y="9"
      width="38"
      height="38"
      rx="3"
      className="fill-none stroke-brass"
      strokeWidth="1.5"
    />
    <text
      x="28"
      y="34"
      textAnchor="middle"
      fontSize="15"
      letterSpacing="2"
      className="fill-gold-ink font-hand"
    >
      POST
    </text>
    <path
      d="M60 18c10-4 20 4 32-2M60 30c10-4 20 4 32-2M60 42c10-4 20 4 32-2"
      className="fill-none stroke-brass"
      strokeWidth="2"
      strokeLinecap="round"
      opacity=".7"
    />
  </svg>
)

/** Phone and email rows: a 44px target with its icon and a pencil-stroke underline. */
const direct = [
  { label: 'Phone / WhatsApp', href: `tel:${site.phoneE164}`, text: site.phone, Icon: Phone },
  { label: 'Email', href: `mailto:${site.email}`, text: site.email, Icon: Mail },
]

/** A glass postcard: both addresses, phone, email, WhatsApp and a map of the registered office. */
export function Postcard() {
  const [registered] = site.addresses
  return (
    <aside aria-label="Our addresses" className="min-w-0">
      <Glass radius="lg" className="p-4 sm:p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-h3">Where to find us</h2>
          <PostStamp className="-mt-2 shrink-0 -rotate-3" />
        </div>
        <dl className="mt-6 grid gap-6 text-small sm:grid-cols-2 lg:grid-cols-1">
          {site.addresses.map(({ label, lines }) => (
            <div key={label}>
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-1">
                <address className="not-italic">
                  {lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </dd>
            </div>
          ))}
          {direct.map(({ label, href, text, Icon }) => (
            <div key={href}>
              <dt className="eyebrow">{label}</dt>
              <dd>
                <a href={href} className="inline-flex min-h-11 items-center gap-2 text-forest">
                  <Icon aria-hidden size={18} className="shrink-0" />
                  <span className="link min-w-0 wrap-anywhere">{text}</span>
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <a
          href={whatsappLink(
            `Hello ${site.shortName}, I would like to know more about your books.`,
          )}
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
      </Glass>
    </aside>
  )
}
