import { BookOpenText, CalendarDays, GraduationCap, House, Mail, QrCode, Users } from 'lucide-react'

export const NAV = [
  { href: '/', label: 'Home', short: 'Home', icon: House },
  { href: '/catalog', label: 'Books', short: 'Books', icon: BookOpenText },
  { href: '/about', label: 'About', short: 'About', icon: Users },
  { href: '/events', label: 'Events', short: 'Events', icon: CalendarDays },
  { href: '/web-support', label: 'Web Support', short: 'Support', icon: GraduationCap },
  { href: '/resources', label: 'QR Corner', short: 'QR', icon: QrCode },
  { href: '/contact', label: 'Contact', short: 'Contact', icon: Mail },
]

export const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)
