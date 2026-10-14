'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'
import { updatePassword, type FormState } from '@/lib/auth/actions'

/** New password, typed twice; the Server Action checks the session again. */
export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(updatePassword, {})
  return (
    <form action={action} className="space-y-5" aria-label="Set a new password">
      <Field label="New password" hint="At least 8 characters">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass(!!state.error)}
        />
      </Field>
      <Field label="Type it again">
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass(!!state.error)}
        />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? 'Saving…' : 'Save the new password'}
      </Button>
    </form>
  )
}
