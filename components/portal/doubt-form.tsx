'use client'

import { Send } from 'lucide-react'
import { useActionState } from 'react'
import { askDoubt, type PublicFormState } from '@/app/web-support/actions'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'

type Defaults = { name?: string; email?: string; school?: string; question?: string }

/** "Ask a doubt": saved for the admins (and emailed when Web3Forms is set up). `?q=` pre-fills
 *  the question, which is how the chatbot's "Ask our team" button arrives here. */
export function DoubtForm({ defaults = {} }: { defaults?: Defaults }) {
  const [state, action, pending] = useActionState<PublicFormState, FormData>(askDoubt, {})
  if (state.done)
    return (
      <div role="status" data-testid="doubt-sent">
        <h3>Thank you, we have your question.</h3>
        <p className="mt-2">Our team will answer at {state.email}.</p>
      </div>
    )
  return (
    <form action={action} className="space-y-5" aria-label="Ask a doubt">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <input type="hidden" name="page" value="/web-support/help" />
      <Field label="Your question">
        <textarea
          name="question"
          required
          minLength={5}
          maxLength={1000}
          rows={4}
          defaultValue={defaults.question}
          className={inputClass(!!state.error)}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            defaultValue={defaults.name}
            className={inputClass()}
          />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaults.email}
            className={inputClass()}
          />
        </Field>
      </div>
      <Field label="School (optional)">
        <input
          name="school"
          maxLength={160}
          autoComplete="organization"
          defaultValue={defaults.school}
          className={inputClass()}
        />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        <Send aria-hidden size={18} /> {pending ? 'Sending…' : 'Send my question'}
      </Button>
    </form>
  )
}
