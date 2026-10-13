import { site } from '@/content/site'

// schema.org Organization: company name, both addresses, phone, email and logo.
const address = ({ label, lines }: { label: string; lines: readonly string[] }) => ({
  '@type': 'PostalAddress',
  name: label,
  streetAddress: lines[0],
  addressLocality: lines[1],
  addressRegion: 'Uttar Pradesh',
  postalCode: lines[2].match(/\d{6}/)?.[0],
  addressCountry: 'IN',
})

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  logo: `${site.url}/brand/logo-full.svg`,
  email: site.email,
  telephone: site.phoneE164,
  address: site.addresses.map(address),
  founder: site.founders.map((name) => ({ '@type': 'Person', name })),
}

export const OrganizationJsonLd = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
  />
)
