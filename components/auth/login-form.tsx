'use client'

import { LogIn } from 'lucide-react'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'
import { TurnLink } from '@/components/ui/turn-link'
import { signIn, type FormState } from '@/lib/auth/actions'

/** Email + password on the glass card; errors come back from the Server Action. */
export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {})
  return (
    <form action={action} className="space-y-5" aria-label="Sign in">
      {next && <input type="hidden" name="next" value={next} />}
      {/* Honeypot: hidden from people, filled in by bots. */}
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
      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass(!!state.error)}
        />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button type="submit" disabled={pending} aria-busy={pending}>
          <LogIn aria-hidden size={18} /> {pending ? 'Signing in…' : 'Sign in'}
        </Button>
        <TurnLink href="/login/forgot" className="link text-small font-semibold text-forest">
          Forgot password?
        </TurnLink>
      </div>
    </form>
  )
}
