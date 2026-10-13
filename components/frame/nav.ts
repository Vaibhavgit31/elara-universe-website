import { BookOpenText, CalendarDays, House, Mail, QrCode, Users } from 'lucide-react'

export const NAV = [
  { href: '/', label: 'Home', short: 'Home', icon: House },
  { href: '/catalog', label: 'Catalog', short: 'Catalog', icon: BookOpenText },
  { href: '/about', label: 'About Us', short: 'About', icon: Users },
  { href: '/events', label: 'Events', short: 'Events', icon: CalendarDays },
  { href: '/contact', label: 'Contact', short: 'Contact', icon: Mail },
  { href: '/resources', label: 'QR Corner', short: 'QR', icon: QrCode },
]

export const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)
