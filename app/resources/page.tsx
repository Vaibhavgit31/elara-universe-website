import type { Metadata } from 'next'
import { QrCorner } from '@/components/resources/qr-corner'

export const metadata: Metadata = {
  title: 'QR Corner',
  description:
    'Scanned a QR code from your Elara Universe book? Your learning corner is being set up.',
}

export default function ResourcesPage() {
  return <QrCorner />
}
