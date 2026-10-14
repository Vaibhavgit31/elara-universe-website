'use client'

import { LazyMotion, Reorder, domMax, useDragControls } from 'framer-motion'
import { ArrowDown, ArrowUp, Check, GripVertical, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Glass } from '@/components/ui/glass'
import { Tag } from '@/components/ui/tag'
import { cn } from '@/lib/cn'
import { paperLabels, typeName, type Language } from '@/lib/test-maker/paper'
import type { Question, Section } from '@/lib/test-maker/types'

// Step 2 of the Test Maker: edit, reorder (drag the handle, or Move up / Move down from the
// keyboard), delete, regenerate one question, add your own and change marks, with live totals.
// Reorder is Motion's drag-to-reorder list (https://motion.dev/docs/react-reorder); it needs the
// full `motion` components, so this part sits in its own non-strict LazyMotion with domMax.

const field =
  'mt-1 block w-full rounded-sm border border-sage bg-white/80 px-3 py-2 text-evergreen focus:border-forest focus:outline-none'
const iconButton =
  'focus-glow inline-flex size-11 items-center justify-center rounded-full text-forest hover:bg-mint disabled:opacity-40'

type Actions = {
  update: (patch: Partial<Question>) => void
  remove: () => void
  move: (step: -1 | 1) => void
  regenerate: () => void
}

function QuestionCard({
  question,
  n,
  first,
  last,
  language,
  busy,
  actions,
}: {
  question: Question
  n: number
  first: boolean
  last: boolean
  language: Language
  busy: boolean
  actions: Actions
}) {
  const drag = useDragControls()
  const l = paperLabels(language)
  // Any edit by the teacher counts as checked: the AI label goes.
  const edit = (patch: Partial<Question>) => actions.update({ ...patch, source: 'teacher' })
  const hi = language === 'hi'
  return (
    <Reorder.Item
      value={question}
      dragListener={false}
      dragControls={drag}
      className="list-none"
      data-testid="editor-question"
    >
      <Glass spotlight={false} className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label={`Drag question ${n} to reorder`}
            onPointerDown={(e) => drag.start(e)}
            className={cn(iconButton, 'cursor-grab touch-none active:cursor-grabbing')}
          >
            <GripVertical aria-hidden size={20} />
          </button>
          <span className="font-heading font-bold">Q{n}</span>
          {question.source === 'ai' && (
            <>
              <Tag className="bg-hindi-tint">AI draft — please check</Tag>
              <button
                type="button"
                onClick={() => actions.update({ source: 'teacher' })}
                className="link inline-flex min-h-11 items-center gap-1 text-small font-semibold"
              >
                <Check aria-hidden size={16} /> Mark checked
              </button>
            </>
          )}
          <span className="ml-auto flex">
            <button
              type="button"
              aria-label={`Move question ${n} up`}
              disabled={first}
              onClick={() => actions.move(-1)}
              className={iconButton}
            >
              <ArrowUp aria-hidden size={18} />
            </button>
            <button
              type="button"
              aria-label={`Move question ${n} down`}
              disabled={last}
              onClick={() => actions.move(1)}
              className={iconButton}
            >
              <ArrowDown aria-hidden size={18} />
            </button>
            <button
              type="button"
              aria-label={`Regenerate question ${n}`}
              disabled={busy}
              onClick={actions.regenerate}
              className={iconButton}
            >
              <RefreshCw aria-hidden size={18} className={cn(busy && 'animate-spin')} />
            </button>
            <button
              type="button"
              aria-label={`Delete question ${n}`}
              onClick={actions.remove}
              className={iconButton}
            >
              <Trash2 aria-hidden size={18} />
            </button>
          </span>
        </div>
        <div className={cn('mt-3 grid gap-3', hi && 'font-devanagari')} lang={hi ? 'hi' : 'en'}>
          <label className="block text-small font-semibold text-forest">
            Question
            <textarea
              rows={2}
              value={question.text}
              onChange={(e) => edit({ text: e.target.value })}
              className={field}
            />
          </label>
          {question.type === 'mcq' && (
            <fieldset className="grid gap-2 sm:grid-cols-2">
              <legend className="mb-1 text-small font-semibold text-forest">
                Options (choose the correct one)
              </legend>
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    aria-label={`Option ${l.options[i]} is correct`}
                    checked={option === question.answer && option !== ''}
                    onChange={() => edit({ answer: option })}
                    className="size-5 accent-forest"
                  />
                  <input
                    aria-label={`Option ${l.options[i]}`}
                    value={option}
                    onChange={(e) =>
                      edit({
                        options: question.options.map((o, k) => (k === i ? e.target.value : o)),
                        answer: question.answer === option ? e.target.value : question.answer,
                      })
                    }
                    className={field}
                  />
                </div>
              ))}
            </fieldset>
          )}
          {question.type === 'match' &&
            question.pairs.map((pair, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                {(['left', 'right'] as const).map((side) => (
                  <input
                    key={side}
                    aria-label={`Pair ${i + 1}, ${side} side`}
                    value={pair[side]}
                    onChange={(e) =>
                      edit({
                        pairs: question.pairs.map((p, k) =>
                          k === i ? { ...p, [side]: e.target.value } : p,
                        ),
                      })
                    }
                    className={field}
                  />
                ))}
              </div>
            ))}
          {question.type === 'truefalse' && (
            <label className="block text-small font-semibold text-forest">
              Answer
              <select
                value={question.answer}
                onChange={(e) => edit({ answer: e.target.value })}
                className={field}
              >
                <option value={l.true}>{l.true}</option>
                <option value={l.false}>{l.false}</option>
              </select>
            </label>
          )}
          {!['mcq', 'match', 'truefalse'].includes(question.type) && (
            <label className="block text-small font-semibold text-forest">
              Answer for the key
              <textarea
                rows={2}
                value={question.answer}
                onChange={(e) => edit({ answer: e.target.value })}
                className={field}
              />
            </label>
          )}
          <label className="flex items-center gap-2 text-small font-semibold text-forest">
            Marks
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={question.marks}
              onChange={(e) => edit({ marks: Number(e.target.value) || 0 })}
              className={cn(field, 'mt-0 w-24')}
            />
          </label>
        </div>
      </Glass>
    </Reorder.Item>
  )
}

/** A blank question of the section's type, written by the teacher. */
export const blankQuestion = (
  type: Question['type'],
  marks: number,
  language: Language,
): Question => ({
  id: crypto.randomUUID().slice(0, 12),
  type,
  text: '',
  options: type === 'mcq' ? ['', '', '', ''] : [],
  pairs: type === 'match' ? [1, 2, 3, 4].map(() => ({ left: '', right: '' })) : [],
  answer: type === 'truefalse' ? paperLabels(language).true : '',
  marks,
  difficulty: 'medium',
  chapter: '',
  source: 'teacher',
})

export function Editor({
  sections,
  language,
  onChange,
  onRegenerate,
  regenerating,
}: {
  sections: Section[]
  language: Language
  onChange: (next: Section[]) => void
  onRegenerate: (section: number, question: number) => void
  /** The id of the question being regenerated, if any. */
  regenerating: string | null
}) {
  const setQuestions = (s: number, questions: Question[]) =>
    onChange(sections.map((section, i) => (i === s ? { ...section, questions } : section)))
  // Questions are numbered straight through the paper.
  const before = sections.map((_, i) =>
    sections.slice(0, i).reduce((count, section) => count + section.questions.length, 0),
  )
  return (
    <LazyMotion features={domMax}>
      <div className="space-y-10 print:hidden">
        {sections.map((section, s) => {
          const marks = section.questions.reduce((sum, q) => sum + q.marks, 0)
          return (
            <section key={section.type} aria-labelledby={`section-${section.type}`}>
              <h2
                id={`section-${section.type}`}
                className="flex flex-wrap items-baseline gap-x-3 text-h3"
              >
                {typeName[section.type]}
                <span className="font-body text-small font-semibold text-forest">
                  {section.questions.length} questions · {marks} marks
                </span>
              </h2>
              <Reorder.Group
                axis="y"
                values={section.questions}
                onReorder={(questions) => setQuestions(s, questions)}
                className="mt-4 space-y-4"
              >
                {section.questions.map((question, q) => {
                  const list = section.questions
                  return (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      n={before[s] + q + 1}
                      first={q === 0}
                      last={q === list.length - 1}
                      language={language}
                      busy={regenerating === question.id}
                      actions={{
                        update: (patch) =>
                          setQuestions(
                            s,
                            list.map((x) => (x.id === question.id ? { ...x, ...patch } : x)),
                          ),
                        remove: () =>
                          setQuestions(
                            s,
                            list.filter((x) => x.id !== question.id),
                          ),
                        move: (step) => {
                          const next = [...list]
                          ;[next[q], next[q + step]] = [next[q + step], next[q]]
                          setQuestions(s, next)
                        },
                        regenerate: () => onRegenerate(s, q),
                      }}
                    />
                  )
                })}
              </Reorder.Group>
              <button
                type="button"
                onClick={() =>
                  setQuestions(s, [
                    ...section.questions,
                    blankQuestion(section.type, section.questions[0]?.marks ?? 1, language),
                  ])
                }
                className="link mt-4 inline-flex min-h-11 items-center gap-2 font-semibold"
              >
                <Plus aria-hidden size={18} /> Add your own question
              </button>
            </section>
          )
        })}
      </div>
    </LazyMotion>
  )
}
