import { AnswerForm } from '@/components/admin/answer-form'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import type { Doubt } from '@/lib/data/types'

/** One question from Help & Doubts: open ones get the answer box, answered ones show the answer. */
export function DoubtCard({ doubt }: { doubt: Doubt }) {
  return (
    <Glass className="p-6" data-testid="doubt">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h3 className="font-hand text-2xl leading-tight font-normal">{doubt.question}</h3>
        <Tag>{doubt.status}</Tag>
      </div>
      <p className="mt-2 text-small text-forest">
        {[doubt.name, doubt.email, doubt.school].filter(Boolean).join(' · ')}
      </p>
      {doubt.page && <p className="text-small text-forest">Page: {doubt.page}</p>}
      {doubt.status === 'open' ? (
        <AnswerForm doubtId={doubt.id} />
      ) : (
        <div className="mt-6 rounded-sm bg-mint p-4">
          <p className="eyebrow">Answer</p>
          <p className="mt-1">{doubt.answer}</p>
        </div>
      )}
    </Glass>
  )
}
