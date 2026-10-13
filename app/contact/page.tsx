import type { Metadata } from 'next'
import { PageStub } from '@/components/frame/page-stub'

export const metadata: Metadata = { title: 'Contact' }

export default function Page() {
  return <PageStub title="Contact" phase={10} />
}
