import { Mail, MessageCircle, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'
import { LazyMap } from '@/components/contact/lazy-map'
import { buttonClass } from '@/components/ui/button-class'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { site, whatsappLink } from '@/content/site'

// Fence pickets, the two gate doors and their bars, each as a single path.
const pickets = [204, 228, 252, 276, 300].map((x) => `M${x} 148l6-10 6 10v76h-12z`).join(' ')
const doors = [144, 166].map((x) => `M${x} 140h20v84h-20z`).join('')
const bars = [144, 166].map((x) => `M${x + 7} 140v84M${x + 13} 140v84`).join('')
const direct = 'inline-flex min-h-11 items-center gap-2 text-forest'

/** A drawing-red post box on a brass post beside the school gate: sage fence, leaf shrub. */
const GateScene = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 320 240"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <ellipse cx="160" cy="226" rx="150" ry="10" className="fill-mint" />
    <rect x="196" y="160" width="124" height="6" rx="3" className="fill-sage" />
    <rect x="196" y="192" width="124" height="6" rx="3" className="fill-sage" />
    <path d={pickets} className="fill-sage-100 stroke-sage stroke-2" />
    <rect x="130" y="112" width="12" height="112" rx="3" className="fill-forest" />
    <rect x="188" y="112" width="12" height="112" rx="3" className="fill-forest" />
    <path d="M136 116q29-36 58 0" className="fill-none stroke-forest stroke-[6]" />
    <path d="M165 104c-10-8-6-20 0-26 6 6 10 18 0 26z" className="fill-leaf" />
    <path d={doors} className="fill-cream stroke-forest stroke-2" />
    <path d={bars} className="stroke-forest stroke-2" />
    <circle cx="165" cy="182" r="3" className="fill-brass" />
    <circle cx="112" cy="206" r="20" className="fill-leaf" />
    <circle cx="96" cy="214" r="14" className="fill-leaf-700" />
    <circle cx="128" cy="214" r="13" className="fill-sage" />
    <rect x="64" y="152" width="12" height="74" rx="2" className="fill-brass" />
    <rect x="38" y="60" width="64" height="96" rx="10" className="fill-drawing" />
    <path d="M70 60h22a10 10 0 0 1 10 10v76a10 10 0 0 1-10 10H70z" className="fill-evergreen/15" />
    <path d="M34 64a36 18 0 0 1 72 0z" className="fill-drawing" />
    <path d="M34 64h72" className="stroke-evergreen/25 stroke-2" />
    <g transform="rotate(-10 70 80)">
      <rect x="61" y="74" width="18" height="12" className="fill-paper stroke-sage stroke-[1.5]" />
      <path d="M61 74l9 7 9-7" className="fill-none stroke-sage stroke-[1.5]" />
    </g>
    <rect x="52" y="84" width="36" height="7" rx="3.5" className="fill-evergreen/60" />
    <rect x="52" y="102" width="36" height="22" rx="3" className="fill-cream" />
    <path d="M58 110h24M58 116h16" className="stroke-sage stroke-2" />
    <path d="M42 134h56" className="stroke-evergreen/25 stroke-2" />
  </svg>
)

/** The school-gate postbox: a short letter on glass, every direct way to reach us, and the map. */
export function Postbox() {
  const [registered] = site.addresses
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div>
        {/* [PLACEHOLDER] wording of the lead */}
        <SectionHeading
          eyebrow="School gate"
          title="Drop a letter in the"
          accent="postbox"
          crayon="drawing"
          lead="Request a sample copy, ask about prices for your school, or just say hello."
        />
        <GateScene className="mt-8 w-full max-w-sm" />
        <address className="mt-8 text-small not-italic">
          <span className="eyebrow">{registered.label}</span>
          {registered.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <div className="mt-4 max-w-sm">
          <LazyMap
            query={`${registered.lines.join(', ')}, India`}
            title="Map of the registered office in Noida"
          />
        </div>
      </div>
      <Glass radius="lg" className="p-4 sm:p-6 md:p-8">
        <ContactForm compact />
        {/* [PLACEHOLDER] wording of the label and the WhatsApp opening line */}
        <p className="mt-6 eyebrow">Or reach us directly</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={whatsappLink(
              `Hello ${site.shortName}, I would like to know more about your books.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('primary')}
          >
            <MessageCircle aria-hidden size={20} /> Chat on WhatsApp
          </a>
          <a href={`tel:${site.phoneE164}`} className={direct}>
            <Phone aria-hidden size={18} /> <span className="link">{site.phone}</span>
          </a>
          <a href={`mailto:${site.email}`} className={direct}>
            <Mail aria-hidden size={18} /> <span className="link break-words">{site.email}</span>
          </a>
        </div>
      </Glass>
    </div>
  )
}
