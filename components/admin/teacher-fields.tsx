import { Chips, Field, inputClass } from '@/components/ui/form'
import { subjectLabel } from '@/content/series'
import type { Profile } from '@/lib/data/types'

export type TeacherDefaults = Partial<
  Pick<Profile, 'name' | 'email' | 'school' | 'phone' | 'classes' | 'subjects'>
>

const classOptions = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => [String(n), String(n)])
const subjectOptions = Object.entries(subjectLabel)

/** Name, (email,) school, phone and the class and subject chips: shared by the new and edit forms. */
export function TeacherFields({
  defaults = {},
  withEmail = false,
}: {
  defaults?: TeacherDefaults
  /** Only a new account gets an email field; it cannot be changed later. */
  withEmail?: boolean
}) {
  return (
    <>
      <Field label="Name">
        <input
          name="name"
          required
          minLength={2}
          autoComplete="name"
          defaultValue={defaults.name}
          className={inputClass()}
        />
      </Field>
      {withEmail && (
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaults.email}
            className={inputClass()}
          />
        </Field>
      )}
      <Field label="School">
        <input
          name="school"
          autoComplete="organization"
          defaultValue={defaults.school}
          className={inputClass()}
        />
      </Field>
      <Field label="Phone">
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={defaults.phone}
          className={inputClass()}
        />
      </Field>
      <Chips
        legend="Classes"
        name="classes"
        options={classOptions}
        checked={defaults.classes?.map(String)}
      />
      <Chips
        legend="Subjects"
        name="subjects"
        options={subjectOptions}
        checked={defaults.subjects}
      />
    </>
  )
}
