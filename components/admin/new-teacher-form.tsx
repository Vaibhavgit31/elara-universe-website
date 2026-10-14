'use client'

import { UserPlus } from 'lucide-react'
import { useActionState } from 'react'
import { createTeacher, type CreateState } from '@/app/admin/actions'
import { TeacherFields, type TeacherDefaults } from '@/components/admin/teacher-fields'
import { TemporaryPassword } from '@/components/admin/temporary-password'
import { Button } from '@/components/ui/button'
import { Chips, Notice } from '@/components/ui/form'
import { Glass } from '@/components/ui/glass'

const handover = [
  ['invite', 'Send an invite email'],
  ['password', 'Show a one-time password'],
]

/** What the admin sees once the account exists: the email plus the invite or the password. */
function AccountCreated({
  id,
  email,
  temporaryPassword,
  invited,
}: NonNullable<CreateState['created']>) {
  return (
    <div data-testid="account-created">
      <h2>Account created</h2>
      <p className="mt-4">
        <span className="eyebrow">Email</span>
        <span className="block font-bold">{email}</span>
      </p>
      <div className="mt-6">
        {temporaryPassword ? (
          <TemporaryPassword value={temporaryPassword} />
        ) : invited ? (
          <p>An invite email has been sent to {email}.</p>
        ) : (
          <p>
            In mock mode no email is sent; the account can sign in with the one-time password
            instead.
          </p>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href={`/admin/teachers/${id}`}>Open the account</Button>
        <Button href="/admin" variant="secondary">
          Back to Admin
        </Button>
      </div>
    </div>
  )
}

/** The new-account form on glass; after a successful submit the same panel shows the result. */
export function NewTeacherForm({
  defaults,
  requestId,
}: {
  defaults?: TeacherDefaults
  /** The access request this account answers; it is marked approved on success. */
  requestId?: string
}) {
  const [state, action, pending] = useActionState<CreateState, FormData>(createTeacher, {})
  return (
    <Glass radius="lg" className="p-6 sm:p-8">
      {state.created ? (
        <AccountCreated {...state.created} />
      ) : (
        <form action={action} className="space-y-5" aria-label="New teacher account">
          {requestId && <input type="hidden" name="request" value={requestId} />}
          <TeacherFields defaults={defaults} withEmail />
          <Chips
            legend="Hand over"
            name="mode"
            type="radio"
            options={handover}
            checked={['invite']}
          />
          {state.error && <Notice>{state.error}</Notice>}
          <Button type="submit" disabled={pending} aria-busy={pending}>
            <UserPlus aria-hidden size={18} /> {pending ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      )}
    </Glass>
  )
}
