import { mockMode } from '@/lib/auth/config'
import { demoAccounts } from '@/lib/data/memory-store'

/** Shown wherever accounts are involved while Supabase is not configured. */
export function MockNote({ accounts = false }: { accounts?: boolean }) {
  if (!mockMode) return null
  return (
    <div
      role="note"
      data-testid="mock-note"
      className="rounded-sm border-l-4 border-brass bg-hindi-tint p-4 text-small"
    >
      <p className="font-bold">Mock mode: no Supabase keys are set.</p>
      <p className="mt-1">
        Accounts live in this server&apos;s memory and reset on restart; no emails are sent. See
        SETUP-SUPABASE.md to connect a real project.
      </p>
      {accounts && (
        <ul className="mt-2 space-y-1">
          {demoAccounts.map((a) => (
            <li key={a.email}>
              <span className="font-semibold">{a.role}</span>: {a.email} /{' '}
              <code className="rounded-sm bg-cream px-1">{a.password}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
