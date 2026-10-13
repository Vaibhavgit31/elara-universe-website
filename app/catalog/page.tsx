import type { Metadata } from 'next'
import { PageStub } from '@/components/frame/page-stub'

export const metadata: Metadata = { title: 'Catalog' }

export default function Page() {
  return <PageStub title="Catalog" phase={6} />
}
