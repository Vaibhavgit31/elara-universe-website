'use client'

import { Save } from 'lucide-react'
import { useActionState } from 'react'
import { updateProfile, type ProfileState } from '@/app/web-support/actions'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'
import type { Profile } from '@/lib/data/types'

/** A teacher's own contact details; classes, subjects and the email stay with the admins. */
export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {})
  return (
    <form action={action} className="space-y-5" aria-label="Your details">
      <Field label="Name">
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          defaultValue={profile.name}
          className={inputClass()}
        />
      </Field>
      <Field label="School">
        <input
          name="school"
          maxLength={160}
          autoComplete="organization"
          defaultValue={profile.school}
          className={inputClass()}
        />
      </Field>
      <Field label="Phone">
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={profile.phone}
          className={inputClass()}
        />
      </Field>
      {state.error && <Notice>{state.error}</Notice>}
      {state.message && <Notice tone="note">{state.message}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        <Save aria-hidden size={18} /> {pending ? 'Saving…' : 'Save my details'}
      </Button>
    </form>
  )
}
