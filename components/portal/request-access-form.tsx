'use client'

import { Send } from 'lucide-react'
import { useActionState } from 'react'
import { requestAccess, type PublicFormState } from '@/app/web-support/actions'
import { Button } from '@/components/ui/button'
import { Chips, Field, Notice, inputClass } from '@/components/ui/form'
import { series } from '@/content/series'

const roles = [
  ['teacher', 'Teacher'],
  ['principal', 'Principal'],
  ['coordinator', 'Coordinator'],
]
const classes = [1, 2, 3, 4, 5, 6, 7, 8]

/** The public "Request access" form: saved for the admins (and emailed to them when Web3Forms is
 *  set up), who create the account in one click. */
export function RequestAccessForm() {
  const [state, action, pending] = useActionState<PublicFormState, FormData>(requestAccess, {})
  if (state.done)
    return (
      <div role="status" data-testid="request-sent">
        <h3>Thank you, your request is in.</h3>
        <p className="mt-2">
          We will write to {state.email} as soon as your teacher account is ready.
        </p>
      </div>
    )
  return (
    <form action={action} className="space-y-5" aria-label="Request access">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            className={inputClass()}
          />
        </Field>
        <Field label="School">
          <input
            name="school"
            required
            minLength={2}
            maxLength={160}
            autoComplete="organization"
            className={inputClass()}
          />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inputClass()} />
        </Field>
        <Field label="Phone">
          <input name="phone" type="tel" required autoComplete="tel" className={inputClass()} />
        </Field>
      </div>
      <Chips legend="Your role" name="role" type="radio" options={roles} checked={['teacher']} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Book">
          <select
            name="series"
            required
            className={`${inputClass()} cursor-pointer`}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a series
            </option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Class">
          <select
            name="class"
            required
            className={`${inputClass()} cursor-pointer`}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a class
            </option>
            {classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Anything else? (optional)">
        <textarea name="message" rows={3} maxLength={1000} className={inputClass()} />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        <Send aria-hidden size={18} /> {pending ? 'Sending…' : 'Send the request'}
      </Button>
    </form>
  )
}
