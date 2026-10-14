'use client'

import { Send } from 'lucide-react'
import { useActionState } from 'react'
import { answerDoubt } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'
import type { FormState } from '@/lib/auth/actions'

/** The answer box under an open doubt; once sent, the card shows the answer instead. */
export function AnswerForm({ doubtId }: { doubtId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(answerDoubt, {})
  return (
    <form action={action} className="mt-6 space-y-4" aria-label="Answer this doubt">
      <input type="hidden" name="id" value={doubtId} />
      <Field label="Answer">
        <textarea
          name="answer"
          required
          minLength={2}
          rows={3}
          className={inputClass(!!state.error)}
        />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        <Send aria-hidden size={18} /> {pending ? 'Sending…' : 'Send answer'}
      </Button>
    </form>
  )
}
