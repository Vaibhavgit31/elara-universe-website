import { UserPlus, X } from 'lucide-react'
import { declineRequest } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { bookBySlug } from '@/content/books'
import type { AccessRequest } from '@/lib/data/types'

/** "Basic Hindi Reader Class 3" when the slug is a known book, else whatever was sent. */
const bookLabel = ({ book, class: cls }: AccessRequest) => {
  const found = bookBySlug(book)
  return found ? `${found.series} Class ${cls}` : book
}

/** One request for a teacher account; new ones can become an account or be declined. */
export function RequestCard({ request }: { request: AccessRequest }) {
  return (
    <Glass className="flex h-full flex-col p-6" data-testid="access-request">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3>{request.name}</h3>
          <p className="text-small text-forest">
            {request.school} · <span className="capitalize">{request.role}</span>
          </p>
        </div>
        <Tag>{request.status}</Tag>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-1 text-small sm:grid-cols-[auto_1fr]">
        <dt className="eyebrow">Email</dt>
        <dd>{request.email}</dd>
        <dt className="eyebrow">Phone</dt>
        <dd>{request.phone}</dd>
        <dt className="eyebrow">Book</dt>
        <dd>{bookLabel(request)}</dd>
      </dl>
      {request.message && (
        <p className="mt-4 font-hand text-xl leading-tight text-evergreen">“{request.message}”</p>
      )}
      {request.status === 'new' && (
        <div className="mt-auto flex flex-wrap gap-4 pt-6">
          <Button href={`/admin/teachers/new?request=${request.id}`}>
            <UserPlus aria-hidden size={18} /> Create account
          </Button>
          <form action={declineRequest}>
            <input type="hidden" name="id" value={request.id} />
            <Button type="submit" variant="secondary">
              <X aria-hidden size={18} /> Decline
            </Button>
          </form>
        </div>
      )}
    </Glass>
  )
}
