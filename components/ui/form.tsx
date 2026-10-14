import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A labelled control with an optional hint and an error line (shared by every form). */
export const Field = ({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) => (
  <label className="block">
    <span className="eyebrow">{label}</span>
    {children}
    {hint && !error && <span className="mt-1 block text-small text-forest">{hint}</span>}
    {error && (
      <span role="alert" className="mt-1 block text-small font-semibold text-drawing">
        {error}
      </span>
    )}
  </label>
)

/** The pencil-line input: no box, a sage rule that turns forest on focus and drawing-red on error. */
export const inputClass = (invalid?: boolean) =>
  cn(
    'mt-1 block w-full border-0 border-b-2 border-sage bg-transparent px-1 py-2 font-body text-body text-evergreen placeholder:text-sage focus:border-forest focus:outline-none',
    invalid && 'border-drawing',
  )

/** A pill that holds a checkbox or radio; it fills in when checked. */
export const chipClass =
  'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-sage px-4 text-small font-semibold text-forest has-checked:border-forest has-checked:bg-sage-100 has-checked:text-evergreen'

/** One line of feedback under a form: an error (drawing) or a note (hindi tint). */
export const Notice = ({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'note'
  children: ReactNode
}) => (
  <p
    role={tone === 'error' ? 'alert' : 'status'}
    className={cn(
      'rounded-sm p-4 text-small',
      tone === 'error' ? 'bg-drawing-tint' : 'bg-hindi-tint',
    )}
  >
    {children}
  </p>
)

/** A row of pill chips, each holding a checkbox or radio (a fieldset with the legend as label). */
export function Chips({
  legend,
  name,
  type = 'checkbox',
  options,
  checked = [],
}: {
  legend: string
  name: string
  type?: 'checkbox' | 'radio'
  /** [value, label] pairs. */
  options: string[][]
  checked?: string[]
}) {
  return (
    <fieldset>
      <legend className="eyebrow">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([value, label]) => (
          <label key={value} className={chipClass}>
            <input
              type={type}
              name={name}
              value={value}
              defaultChecked={checked.includes(value)}
              className="accent-forest"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
