import type { Metadata } from 'next'
import { PageStub } from '@/components/frame/page-stub'

export const metadata: Metadata = { title: 'About Us' }

export default function Page() {
  return <PageStub title="About Us" phase={8} />
}
