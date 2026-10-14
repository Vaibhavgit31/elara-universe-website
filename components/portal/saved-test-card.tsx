import { FileText } from 'lucide-react'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { TurnLink } from '@/components/ui/turn-link'
import { bookBySlug } from '@/content/books'
import { subjectLabel } from '@/content/series'
import type { SavedTest } from '@/lib/data/types'
import { formatDate } from '@/lib/events'

/** One saved paper in My tests: title (opens it), book and class, last change. */
export function SavedTestCard({ test }: { test: SavedTest }) {
  return (
    <Glass className="flex h-full items-start gap-4 p-5" data-testid="saved-test">
      <FileText aria-hidden size={28} className="mt-1 shrink-0 text-forest" />
      <div className="min-w-0 flex-1">
        <h2 className="text-lg">
          <TurnLink href={`/web-support/tests/${test.id}`} className="link">
            {test.title}
          </TurnLink>
        </h2>
        <p className="mt-1 text-small text-forest">
          {bookBySlug(test.bookSlug)?.title ?? test.bookSlug} · changed{' '}
          {formatDate(test.updatedAt.slice(0, 10))}
        </p>
        <Tag tone={test.subject} className="mt-3">
          {subjectLabel[test.subject]} · Class {test.class}
        </Tag>
      </div>
    </Glass>
  )
}
