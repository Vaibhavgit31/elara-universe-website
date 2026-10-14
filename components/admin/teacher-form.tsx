'use client'

import { Save } from 'lucide-react'
import { useActionState } from 'react'
import { updateTeacher } from '@/app/admin/actions'
import { TeacherFields } from '@/components/admin/teacher-fields'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/ui/form'
import type { FormState } from '@/lib/auth/actions'
import type { Profile } from '@/lib/data/types'

/** Edits a teacher's details; the chips come pre-checked from the profile. */
export function TeacherForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateTeacher, {})
  return (
    <form action={action} className="mt-6 space-y-5" aria-label="Teacher details">
      <input type="hidden" name="id" value={profile.id} />
      <TeacherFields defaults={profile} />
      {state.error && <Notice>{state.error}</Notice>}
      {state.message && <Notice tone="note">{state.message}</Notice>}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        <Save aria-hidden size={18} /> {pending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
