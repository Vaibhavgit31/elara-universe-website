import Image from 'next/image'
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

// The book's back cover: cream board with a brass frame.
export function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-double border-brass bg-cream pb-24 md:pb-0">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.1fr_1fr_1fr_1.1fr]">
        <div>
          <Image
            src="/brand/logo-full.svg"
            alt={site.name}
            width={1204}
            height={672}
            className="w-56"
          />
          <p className="mt-4 max-w-xs text-small text-forest">{site.tagline}</p>
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
          <ul className="space-y-2 text-small">
            <li>
              <a className="link" href={`tel:${site.phoneE164}`}>
                {site.phone}
              </a>
            </li>
            <li>
              <a className="link break-words" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
          </ul>
        </Column>
      </div>
      <div className="border-t border-sage-100">
        <div className="container-page flex flex-col gap-4 py-6 text-small sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map(({ href, label }) => (
              <TurnLink key={href} href={href} className="link">
                {label}
              </TurnLink>
            ))}
          </nav>
          <ul className="flex gap-3">
            {site.socials.map(({ name, url }) => {
              const Icon = socialIcons[name]
              return (
                <li key={name}>
                  <a
                    href={url || '#'}
                    aria-label={name}
                    className="flex size-11 items-center justify-center rounded-full text-forest hover:bg-sage-100"
                  >
                    <Icon />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <p className="pb-6 text-center text-small text-forest">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}
