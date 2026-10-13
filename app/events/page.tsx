import type { Metadata } from 'next'
import { PageStub } from '@/components/frame/page-stub'

export const metadata: Metadata = { title: 'Events' }

export default function Page() {
  return <PageStub title="Events" phase={9} />
}
