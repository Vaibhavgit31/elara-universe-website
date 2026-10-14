import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { Pencil } from '@/components/classroom/pencil'
import { NAV } from '@/components/frame/nav'
import { socialIcons } from '@/components/ui/social-icons'
import { TurnLink } from '@/components/ui/turn-link'
import { site } from '@/content/site'

const Column = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="mb-3 eyebrow">{title}</h2>
    {children}
  </div>
)

/** Phone and email rows: a 44px target with its icon and a pencil-stroke underline. */
const direct = [
  { href: `tel:${site.phoneE164}`, text: site.phone, Icon: Phone },
  { href: `mailto:${site.email}`, text: site.email, Icon: Mail },
]

/** The back cover, now part of the classroom: a full-width glass band on the mesh with a brass
 *  rule along its top edge, the logo and a hand-written tagline beside a pencil on the desk. */
export function Footer() {
  return (
    // Rendering of the footer waits until it nears the screen (content-visibility), so its
    // handwriting font is not fetched before the page's first paint.
    <footer className="glass mt-16 rounded-none border-x-0 border-t-2 border-b-0 border-t-brass pb-24 [contain-intrinsic-size:auto_640px] [content-visibility:auto] md:pb-0">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-8 lg:gap-12">
        <div>
          <Image
            src="/brand/logo-full.svg"
            alt={site.name}
            width={1204}
            height={672}
            className="w-48 sm:w-56"
          />
          <p className="mt-4 max-w-xs font-hand text-2xl leading-8 text-forest">{site.tagline}</p>
          <Pencil className="mt-6 h-5" tilt={-3} />
        </div>
        {site.addresses.map(({ label, lines }) => (
          <Column key={label} title={label}>
            <address className="text-small not-italic">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Column>
        ))}
        <Column title="Get in touch">
          <ul className="text-small">
            {direct.map(({ href, text, Icon }) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-11 items-center gap-2 text-forest">
                  <Icon aria-hidden size={18} className="shrink-0" />
                  <span className="link min-w-0 wrap-anywhere">{text}</span>
                </a>
              </li>
            ))}
          </ul>
        </Column>
      </div>
      <div className="border-t border-sage-100">
        <div className="container-page flex flex-col gap-6 py-6 text-small md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map(({ href, label }) => (
              <TurnLink key={href} href={href} className="link -my-1.5 py-1.5 font-semibold">
                {label}
              </TurnLink>
            ))}
          </nav>
          <ul className="flex gap-2">
            {site.socials.map(({ name, url }) => {
              const Icon = socialIcons[name]
              return (
                <li key={name}>
                  <a
                    href={url || '#'}
                    aria-label={name}
                    className="focus-glow flex size-11 items-center justify-center rounded-full text-forest hover:bg-mint"
                  >
                    <Icon />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <p className="container-page pb-6 text-small text-forest">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}
