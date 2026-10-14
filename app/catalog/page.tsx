import type { Metadata } from 'next'
import { Catalog } from '@/components/catalog/catalog'
import { Main } from '@/components/frame/main'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Basic Hindi Reader, TechNova and Art Journey textbooks for Classes 1–8. Filter by subject and class.',
}

/** Catalog: the heading band, then the glass filter panel and one shelf band per series. */
export default function CatalogPage() {
  return (
    <Main>
      <Section className="pt-12 md:pt-16">
        <SectionHeading
          as="h1"
          eyebrow="Catalog"
          title="Find a book by subject and"
          accent="class"
          crayon="leaf"
          lead="Three series, Classes 1–8. Pick a subject and a class, then peek inside any book."
        />
      </Section>
      <Catalog />
    </Main>
  )
}
