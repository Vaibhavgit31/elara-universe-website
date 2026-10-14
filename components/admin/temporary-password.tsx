/** A one-time password, shown once (after creating an account or resetting a password). */
export const TemporaryPassword = ({ value }: { value: string }) => (
  <div className="rounded-sm bg-mint p-4">
    <p className="eyebrow">One-time password</p>
    <code
      data-testid="temporary-password"
      className="mt-1 block font-body text-h3 font-bold tracking-wide text-evergreen select-all"
    >
      {value}
    </code>
    <p className="mt-2 text-small text-forest">Copy it now: it is shown only once.</p>
  </div>
)
