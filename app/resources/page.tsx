import type { Metadata } from 'next'
import { PageStub } from '@/components/frame/page-stub'

export const metadata: Metadata = { title: 'QR Corner' }

export default function Page() {
  return <PageStub title="QR Corner" phase={11} />
}
