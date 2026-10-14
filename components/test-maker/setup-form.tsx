'use client'

import { AlertTriangle, Sparkles } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Notice, chipClass, inputClass } from '@/components/ui/form'
import { Glass } from '@/components/ui/glass'
import { bookBySlug, type Book } from '@/content/books'
import { chaptersFor } from '@/content/chapters'
import { typeName } from '@/lib/test-maker/paper'
import { sumPlan, typesFor, withDefaults } from '@/lib/test-maker/defaults'
import type { QuestionType, SectionPlan, Settings } from '@/lib/test-maker/types'

const number = (e: ChangeEvent<HTMLInputElement>) => Number(e.target.value) || 0
const small = `${inputClass()} w-20 text-center`

/** Step 1 of the Test Maker: class → book → chapters → question types → marks, time, header. */
export function SetupForm({
  books,
  settings,
  onChange,
  onDraft,
  busy,
  progress,
  error,
}: {
  /** The books this teacher may make papers for. */
  books: Book[]
  settings: Settings
  onChange: (next: Settings) => void
  onDraft: () => void
  busy: boolean
  progress: string
  error: string
}) {
  const book = bookBySlug(settings.bookSlug)!
  const [logoError, setLogoError] = useState('')
  const classes = [...new Set(books.map((b) => b.class))].sort((a, b) => a - b)
  const list = chaptersFor(book.slug)
  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch })
  const planned = sumPlan(settings.plan)
  const mix = settings.difficulty.easy + settings.difficulty.medium + settings.difficulty.hard

  const pickBook = (slug: string) => onChange(withDefaults(bookBySlug(slug)!, settings))
  const toggleChapter = (title: string) =>
    set({
      chapters: settings.chapters.includes(title)
        ? settings.chapters.filter((c) => c !== title)
        : [...settings.chapters, title],
    })
  const planFor = (type: QuestionType) => settings.plan.find((p) => p.type === type)
  const setPlan = (type: QuestionType, patch: Partial<SectionPlan> | null) => {
    const others = settings.plan.filter((p) => p.type !== type)
    const current = planFor(type) ?? { type, count: 5, marks: 1 }
    const next = patch ? [...others, { ...current, ...patch }] : others
    // Keep the sections in the order of the type list.
    const order = typesFor(book)
    set({ plan: next.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type)) })
  }
  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setLogoError('')
    if (!file) return set({ logo: '' })
    if (file.size > 150_000) return setLogoError('Please choose a logo smaller than 150 KB.')
    const reader = new FileReader()
    reader.onload = () => set({ logo: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <form
      aria-label="Set up the paper"
      className="space-y-6 print:hidden"
      onSubmit={(e) => {
        e.preventDefault()
        onDraft()
      }}
    >
      <Glass radius="lg" spotlight={false} className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
        <Field label="Class">
          <select
            value={book.class}
            onChange={(e) => pickBook(books.find((b) => b.class === Number(e.target.value))!.slug)}
            className={`${inputClass()} cursor-pointer`}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Book">
          <select
            value={book.slug}
            onChange={(e) => pickBook(e.target.value)}
            className={`${inputClass()} cursor-pointer`}
          >
            {books
              .filter((b) => b.class === book.class)
              .map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.title}
                </option>
              ))}
          </select>
        </Field>
      </Glass>

      <Glass radius="lg" spotlight={false} className="p-6 md:p-8">
        <h2 className="text-h3">Chapters</h2>
        {list.needsChecking && (
          <p className="mt-2 text-small text-forest">
            Chapter names were typed from the book’s contents page and still need checking.
          </p>
        )}
        {list.isPlaceholder ? (
          <>
            <p className="mt-2 text-small text-forest">
              The chapter list for this book is coming soon. Type the chapters or topics the paper
              should cover, one per line.
            </p>
            <Field label="Chapters or topics">
              <textarea
                rows={4}
                value={settings.chapters.join('\n')}
                onChange={(e) =>
                  set({
                    chapters: e.target.value
                      .split('\n')
                      .map((c) => c.slice(0, 200))
                      .filter((c, i, all) => c.trim() || i === all.length - 1)
                      .slice(0, 20),
                  })
                }
                className={inputClass()}
              />
            </Field>
          </>
        ) : (
          <fieldset className="mt-4">
            <legend className="sr-only">Chapters to include</legend>
            <div
              className="flex flex-wrap gap-2"
              lang={book.subject === 'hindi' ? 'hi' : undefined}
            >
              {list.chapters.map((c) => (
                <label
                  key={c.id}
                  className={`${chipClass} ${book.subject === 'hindi' ? 'font-devanagari' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={settings.chapters.includes(c.title)}
                    onChange={() => toggleChapter(c.title)}
                    className="accent-forest"
                  />
                  {c.no ? `${c.no}. ` : ''}
                  {c.title}
                </label>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-small">
              <button
                type="button"
                className="link font-semibold"
                onClick={() => set({ chapters: list.chapters.map((c) => c.title) })}
              >
                Select all
              </button>
              <button
                type="button"
                className="link font-semibold"
                onClick={() => set({ chapters: [] })}
              >
                Clear
              </button>
            </div>
          </fieldset>
        )}
      </Glass>

      <Glass radius="lg" spotlight={false} className="p-6 md:p-8">
        <h2 className="text-h3">Question types</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-md text-left text-small">
            <thead className="eyebrow">
              <tr>
                <th scope="col" className="py-2 pr-4">
                  Type
                </th>
                <th scope="col" className="px-2 py-2">
                  Questions
                </th>
                <th scope="col" className="px-2 py-2">
                  Marks each
                </th>
                <th scope="col" className="py-2 pl-2 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {typesFor(book).map((type) => {
                const plan = planFor(type)
                return (
                  <tr key={type} data-testid={`plan-${type}`}>
                    <td className="py-2 pr-4">
                      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-semibold">
                        <input
                          type="checkbox"
                          checked={!!plan}
                          onChange={(e) => setPlan(type, e.target.checked ? {} : null)}
                          className="accent-forest"
                        />
                        {typeName[type]}
                      </label>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        aria-label={`${typeName[type]}: number of questions`}
                        disabled={!plan}
                        value={plan?.count ?? ''}
                        onChange={(e) => setPlan(type, { count: number(e) })}
                        className={small}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min={0.5}
                        max={20}
                        step={0.5}
                        aria-label={`${typeName[type]}: marks each`}
                        disabled={!plan}
                        value={plan?.marks ?? ''}
                        onChange={(e) => setPlan(type, { marks: number(e) })}
                        className={small}
                      />
                    </td>
                    <td className="py-2 pl-2 text-right font-semibold">
                      {plan ? plan.count * plan.marks : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Glass>

      <Glass radius="lg" spotlight={false} className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
        <fieldset className="sm:col-span-2">
          <legend className="eyebrow">Difficulty mix (per cent)</legend>
          <div className="mt-2 flex flex-wrap gap-6">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <label key={level} className="flex items-center gap-2 capitalize">
                {level}
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.difficulty[level]}
                  onChange={(e) =>
                    set({ difficulty: { ...settings.difficulty, [level]: number(e) } })
                  }
                  className={small}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Total marks">
          <input
            type="number"
            min={1}
            max={200}
            value={settings.totalMarks}
            onChange={(e) => set({ totalMarks: number(e) })}
            className={inputClass()}
          />
        </Field>
        <Field label="Time (minutes)">
          <input
            type="number"
            min={5}
            max={240}
            step={5}
            value={settings.minutes}
            onChange={(e) => set({ minutes: number(e) })}
            className={inputClass()}
          />
        </Field>
        {(planned !== settings.totalMarks || mix !== 100) && (
          <div className="sm:col-span-2" data-testid="totals-warning">
            <Notice tone="note">
              <AlertTriangle aria-hidden size={16} className="mr-2 inline" />
              {planned !== settings.totalMarks &&
                `The questions add up to ${planned} marks, not ${settings.totalMarks}. `}
              {mix !== 100 && `The difficulty mix adds up to ${mix}%, not 100%.`}
            </Notice>
          </div>
        )}
      </Glass>

      <Glass radius="lg" spotlight={false} className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
        <Field label="Exam name">
          <input
            value={settings.examName}
            maxLength={120}
            onChange={(e) => set({ examName: e.target.value })}
            className={inputClass()}
          />
        </Field>
        <Field label="School name">
          <input
            value={settings.schoolName}
            maxLength={160}
            onChange={(e) => set({ schoolName: e.target.value })}
            className={inputClass()}
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={settings.date}
            onChange={(e) => set({ date: e.target.value })}
            className={inputClass()}
          />
        </Field>
        <Field label="School logo (optional, PNG or JPEG under 150 KB)">
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={onLogo}
            className="mt-2 block w-full text-small"
          />
          {logoError && (
            <span role="alert" className="mt-1 block text-small font-semibold text-gold-ink">
              {logoError}
            </span>
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Instructions">
            <textarea
              rows={3}
              maxLength={1500}
              value={settings.instructions}
              onChange={(e) => set({ instructions: e.target.value })}
              className={inputClass()}
            />
          </Field>
        </div>
      </Glass>

      {error && <Notice>{error}</Notice>}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={busy} aria-busy={busy}>
          <Sparkles aria-hidden size={18} /> {busy ? 'Drafting…' : 'Draft the paper'}
        </Button>
        <p role="status" className="text-small text-forest">
          {progress}
        </p>
      </div>
    </form>
  )
}
