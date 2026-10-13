// Company facts. Source: PLAYBOOK.md "Company facts" table (logo pack + book covers).
export const site = {
  name: 'Elara Universe Publishers Private Limited',
  shortName: 'Elara Universe',
  tagline:
    'Hindi, Computer and Drawing textbooks for Classes 1–8, aligned to NEP 2020 and NCF 2023.',
  domain: 'elarauniversepublications.com',
  url: 'https://elarauniversepublications.com',
  email: 'info@elarauniversepublications.com',
  phone: '+91 96257 41192',
  phoneE164: '+919625741192',
  curriculum: 'Aligned to NEP 2020 and NCF 2023',
  addresses: [
    {
      label: 'Registered office',
      lines: [
        'D-9, Ground Floor, Block D, Vyapar Marg',
        'Sector 3, Noida, Gautam Buddha Nagar',
        'Uttar Pradesh 201301',
      ],
    },
    {
      label: 'Office',
      lines: [
        'T1-1405, MCC Signature Heights',
        'Raj Nagar Extension, Ghaziabad',
        'Uttar Pradesh 201017',
      ],
    },
  ],
  founders: ['Sunil Sharma', 'Tausif Khan'],
} as const

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.phoneE164.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ''}`
