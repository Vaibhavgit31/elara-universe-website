import type { Metadata } from 'next'
import { Catalog } from '@/components/catalog/catalog'
import { Main } from '@/components/frame/main'
import { Section } from '@/components/ui/section'

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Basic Hindi Reader, TechNova and Art Journey textbooks for Classes 1–8. Filter by subject and class.',
}

export default function CatalogPage() {
  return (
    <Main>
      <Section className="py-12">
        <p className="eyebrow">Catalog</p>
        <h1>Find a book by subject and class</h1>
        <p className="mt-3 mb-8 max-w-prose">
          Three series, Classes 1–8. Pick a subject and a class, then peek inside any book.
        </p>
        <Catalog />
      </Section>
    </Main>
  )
}
