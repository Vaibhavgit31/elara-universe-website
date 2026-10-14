'use client'

import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { Field, inputClass } from '@/components/ui/form'
import { series as allSeries, subjectLabel, type Subject } from '@/content/series'
import { titleHref } from '@/lib/portal'

/**
 * "Select your title": Step 1 subject, Step 2 series (only that subject's). The choice lives in the
 * URL, so links can be shared and Back works; a new subject starts on its first series. Without
 * JavaScript the form submits the same query with its button.
 */
export function TitlePicker({
  subjects,
  subject,
  series,
}: {
  subjects: Subject[]
  subject: Subject
  series: string
}) {
  const router = useRouter()
  const options = allSeries.filter((s) => s.subject === subject)
  const go = (next: Subject, slug?: string) => {
    const target = allSeries.find((s) => s.subject === next && (!slug || s.slug === slug))
    if (target) router.push(titleHref(target), { scroll: false })
  }
  const select = `${inputClass()} cursor-pointer rounded-t-sm bg-white/40 pr-8`
  return (
    <form
      action="/web-support"
      aria-label="Select your title"
      className="grid gap-6 sm:grid-cols-2"
    >
      <Field label="Step 1 · Subject">
        <select
          name="subject"
          value={subject}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => go(e.target.value as Subject)}
          className={select}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {subjectLabel[s]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Step 2 · Series">
        <select
          name="series"
          value={series}
          onChange={(e) => go(subject, e.target.value)}
          className={select}
        >
          {options.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <noscript>
        <button type="submit" className="underline">
          Show the books
        </button>
      </noscript>
    </form>
  )
}
