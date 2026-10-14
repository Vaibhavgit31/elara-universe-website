'use client'

import { KeyRound, Mail, UserRoundCheck, UserRoundX } from 'lucide-react'
import { useActionState } from 'react'
import { resetTeacherPassword, setTeacherActive, type ResetState } from '@/app/admin/actions'
import { TemporaryPassword } from '@/components/admin/temporary-password'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/ui/form'
import type { FormState } from '@/lib/auth/actions'
import type { Profile } from '@/lib/data/types'

/** Account status, (de)activation and the two ways to reset a password. */
export function AccountPanel({ profile, self }: { profile: Profile; self: boolean }) {
  const [active, toggle, toggling] = useActionState<FormState, FormData>(setTeacherActive, {})
  const [reset, resetAction, resetting] = useActionState<ResetState, FormData>(
    resetTeacherPassword,
    {},
  )
  const error = active.error ?? reset.error
  const ToggleIcon = profile.active ? UserRoundX : UserRoundCheck
  return (
    <div className="space-y-6">
      <h2>Account</h2>
      <p>
        <span className="eyebrow">Status</span>
        <span data-testid="account-status" className="block font-bold">
          {profile.active ? 'Active' : 'Deactivated'}
        </span>
      </p>
      {/* An admin never locks themselves out from here. */}
      {!self && (
        <form action={toggle}>
          <input type="hidden" name="id" value={profile.id} />
          <input type="hidden" name="active" value={String(!profile.active)} />
          <Button type="submit" variant="secondary" disabled={toggling} aria-busy={toggling}>
            <ToggleIcon aria-hidden size={18} /> {profile.active ? 'Deactivate' : 'Reactivate'}
          </Button>
        </form>
      )}
      <form action={resetAction} className="flex flex-wrap gap-4" aria-label="Reset the password">
        <input type="hidden" name="id" value={profile.id} />
        <Button type="submit" name="mode" value="email" variant="secondary" disabled={resetting}>
          <Mail aria-hidden size={18} /> Email a reset link
        </Button>
        <Button type="submit" name="mode" value="password" variant="secondary" disabled={resetting}>
          <KeyRound aria-hidden size={18} /> Show a one-time password
        </Button>
      </form>
      {reset.temporaryPassword && <TemporaryPassword value={reset.temporaryPassword} />}
      {reset.message && <Notice tone="note">{reset.message}</Notice>}
      {error && <Notice>{error}</Notice>}
    </div>
  )
}
