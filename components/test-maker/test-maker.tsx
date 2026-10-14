'use client'

import { Download, Eye, PencilLine, Printer, Save, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { saveTest } from '@/app/web-support/test-maker/actions'
import { Editor } from '@/components/test-maker/editor'
import { PaperSheet } from '@/components/test-maker/paper-sheet'
import { SetupForm } from '@/components/test-maker/setup-form'
import { Button } from '@/components/ui/button'
import { Field, Notice, inputClass } from '@/components/ui/form'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { bookBySlug, type Book } from '@/content/books'
import { cn } from '@/lib/cn'
import { buildPaper, languageOf, sumMarks, typeName } from '@/lib/test-maker/paper'
import { settingsSchema, type Question, type Section, type Settings } from '@/lib/test-maker/types'

type Step = 'setup' | 'edit' | 'preview'
const steps: [Step, string, typeof Settings2][] = [
  ['setup', '1. Set up', Settings2],
  ['edit', '2. Edit', PencilLine],
  ['preview', '3. Print', Eye],
]

/** Asks the server for one section (or one replacement question) in the paper's settings. */
async function draft(
  settings: Settings,
  plan: { type: Question['type']; count: number; marks: number },
  avoid?: string[],
) {
  const response = await fetch('/api/test-maker/draft/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      bookSlug: settings.bookSlug,
      chapters: settings.chapters,
      difficulty: settings.difficulty,
      avoid,
      ...plan,
    }),
  })
  const data = (await response.json().catch(() => ({}))) as {
    questions?: Question[]
    error?: string
  }
  if (!response.ok || !data.questions)
    throw new Error(data.error ?? 'Something went wrong. Please try again.')
  return data.questions
}

/**
 * The Test Maker: set up the paper, let Grok draft it section by section, edit it, then print it
 * (Save as PDF) or download it for Word, as Set A or Set B with or without the answer key.
 */
export function TestMaker({
  books,
  initial,
  mock,
}: {
  books: Book[]
  initial: { id?: string; title: string; settings: Settings; sections: Section[] }
  mock: boolean
}) {
  const [id, setId] = useState(initial.id)
  const [title, setTitle] = useState(initial.title)
  const [settings, setSettings] = useState(initial.settings)
  const [sections, setSections] = useState(initial.sections)
  const [step, setStep] = useState<Step>(initial.sections.length ? 'edit' : 'setup')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [set, setSet] = useState<'A' | 'B'>('A')
  const [withKey, setWithKey] = useState(true)
  const [saved, setSaved] = useState('')

  const book = bookBySlug(settings.bookSlug)!
  const language = languageOf(book.subject)
  const total = sumMarks(sections)

  const draftAll = async () => {
    const cleaned = {
      ...settings,
      chapters: settings.chapters.map((c) => c.trim()).filter(Boolean),
    }
    const checked = settingsSchema.safeParse(cleaned)
    if (!checked.success) return setError(checked.error.issues[0].message)
    setSettings(cleaned)
    setError('')
    setBusy(true)
    const drafted: Section[] = []
    try {
      for (const [i, plan] of cleaned.plan.entries()) {
        setProgress(`Drafting section ${i + 1} of ${cleaned.plan.length}: ${typeName[plan.type]}…`)
        drafted.push({ type: plan.type, questions: await draft(cleaned, plan) })
      }
      setSections(drafted)
      setTitle(title || `${cleaned.examName || 'Test'}: ${book.title}`)
      setStep('edit')
      setProgress('')
    } catch (e) {
      // Keep what was drafted so far; the teacher can try again.
      setError(
        `${(e as Error).message}${drafted.length ? ` (${drafted.length} sections were drafted.)` : ''}`,
      )
      setProgress('')
    } finally {
      setBusy(false)
    }
  }

  const regenerate = async (s: number, q: number) => {
    const section = sections[s]
    const old = section.questions[q]
    setRegenerating(old.id)
    setError('')
    try {
      const [fresh] = await draft(
        settings,
        { type: section.type, count: 1, marks: old.marks },
        section.questions.map((x) => x.text),
      )
      setSections((all) =>
        all.map((sec, i) =>
          i === s
            ? { ...sec, questions: sec.questions.map((x) => (x.id === old.id ? fresh : x)) }
            : sec,
        ),
      )
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setRegenerating(null)
    }
  }

  const save = async () => {
    setSaved('')
    const result = await saveTest({ id, title, settings, sections })
    if (result.error) return setError(result.error)
    setError('')
    setId(result.id)
    setSaved('Saved to My tests.')
  }

  const downloadWord = async () => {
    const { paperDocx } = await import('@/lib/test-maker/docx')
    const blob = await paperDocx(buildPaper(settings, sections, set), settings, withKey)
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), {
      href: url,
      download: `${(title || book.title).replace(/[^\p{L}\p{N} _-]+/gu, '').trim() || 'test-paper'} - Set ${set}.docx`,
    }).click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <nav aria-label="Test Maker steps" className="flex flex-wrap gap-2">
          {steps.map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              aria-current={step === key ? 'step' : undefined}
              disabled={key !== 'setup' && !sections.length}
              onClick={() => setStep(key)}
              className={cn(
                'focus-glow inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-small font-semibold disabled:opacity-40',
                step === key ? 'bg-leaf-700 text-white' : 'glass text-forest hover:bg-white/70',
              )}
            >
              <Icon aria-hidden size={16} /> {label}
            </button>
          ))}
        </nav>
        {mock && (
          <span data-testid="test-maker-mock">
            <Tag>Mock mode: sample questions, no AI</Tag>
          </span>
        )}
      </div>

      {step === 'setup' && (
        <SetupForm
          books={books}
          settings={settings}
          onChange={setSettings}
          onDraft={draftAll}
          busy={busy}
          progress={progress}
          error={error}
        />
      )}

      {step !== 'setup' && (
        <Glass
          radius="lg"
          spotlight={false}
          className="flex flex-wrap items-end gap-4 p-5 print:hidden"
        >
          <div className="min-w-0 flex-1 basis-64">
            <Field label="Paper name (for My tests)">
              <input
                value={title}
                maxLength={160}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass()}
              />
            </Field>
          </div>
          <p
            data-testid="live-total"
            className={cn(
              'font-semibold',
              total === settings.totalMarks ? 'text-forest' : 'text-gold-ink',
            )}
          >
            {total} of {settings.totalMarks} marks · {settings.minutes} minutes
          </p>
          <Button type="button" onClick={save}>
            <Save aria-hidden size={18} /> {id ? 'Save changes' : 'Save to My tests'}
          </Button>
          {saved && (
            <p role="status" className="w-full text-small text-forest">
              {saved}{' '}
              <Link href={`/web-support/tests/${id}`} className="link font-semibold">
                Open it from My tests
              </Link>
            </p>
          )}
          {error && (
            <div className="w-full">
              <Notice>{error}</Notice>
            </div>
          )}
        </Glass>
      )}

      {step === 'edit' && (
        <Editor
          sections={sections}
          language={language}
          onChange={setSections}
          onRegenerate={regenerate}
          regenerating={regenerating}
        />
      )}

      {step === 'preview' && (
        <>
          <Glass
            radius="lg"
            spotlight={false}
            className="flex flex-wrap items-center gap-4 p-5 print:hidden"
          >
            <div role="group" aria-label="Set" className="flex gap-2">
              {(['A', 'B'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={set === s}
                  onClick={() => setSet(s)}
                  className={cn(
                    'focus-glow min-h-11 rounded-full px-4 font-semibold',
                    set === s ? 'bg-leaf-700 text-white' : 'glass text-forest',
                  )}
                >
                  Set {s}
                </button>
              ))}
            </div>
            <label className="inline-flex min-h-11 items-center gap-2 font-semibold text-forest">
              <input
                type="checkbox"
                checked={withKey}
                onChange={(e) => setWithKey(e.target.checked)}
                className="size-5 accent-forest"
              />
              Answer key on its own page
            </label>
            <span className="ml-auto flex flex-wrap gap-3">
              <Button type="button" onClick={() => window.print()}>
                <Printer aria-hidden size={18} /> Print or save as PDF
              </Button>
              <Button type="button" variant="secondary" onClick={downloadWord}>
                <Download aria-hidden size={18} /> Download for Word
              </Button>
            </span>
            <p className="w-full text-small text-forest">
              In the print window choose “Save as PDF” and paper size A4. Set B shuffles the
              questions in each section and the answer options.
            </p>
          </Glass>
          <PaperSheet
            paper={buildPaper(settings, sections, set)}
            settings={settings}
            withKey={withKey}
          />
        </>
      )}
    </div>
  )
}
