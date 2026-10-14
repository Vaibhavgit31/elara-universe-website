'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'
import { requestPasswordReset, type FormState } from '@/lib/auth/actions'

/** Asks for the account email and always answers the same way. */
export function ForgotForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordReset, {})
  return (
    <form action={action} className="space-y-5" aria-label="Reset your password">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass(!!state.error)}
        />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      {state.message && <Notice tone="note">{state.message}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? 'Sending…' : 'Send the reset link'}
      </Button>
    </form>
  )
}
