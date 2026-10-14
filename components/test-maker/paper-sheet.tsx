import { cn } from '@/lib/cn'
import { paperLabels, type Paper } from '@/lib/test-maker/paper'
import type { Settings } from '@/lib/test-maker/types'

/** Blank lines to answer on, by question type (none for objective questions). */
const answerLines = { short: 2, long: 5 } as Partial<Record<string, number>>

/**
 * The A4 test paper: school header, sections with marks, then the answer key on its own page.
 * On screen it is a white sheet; printed (Save as PDF) it fills the A4 page set in globals.css,
 * and Devanagari is shaped by the browser with Noto Sans Devanagari, conjuncts and all.
 */
export function PaperSheet({
  paper,
  settings,
  withKey,
}: {
  paper: Paper
  settings: Settings
  withKey: boolean
}) {
  const l = paperLabels(paper.language)
  const hi = paper.language === 'hi'
  const { book } = paper
  return (
    <article
      id="paper-print"
      lang={hi ? 'hi' : 'en'}
      data-testid="paper"
      className={cn(
        'mx-auto w-full max-w-[210mm] bg-white p-6 text-[11.5pt] leading-normal text-black shadow-page sm:p-[14mm] print:max-w-none print:p-0 print:shadow-none',
        hi ? 'font-devanagari' : 'font-body',
      )}
    >
      <header className="border-b-2 border-black pb-3 text-center">
        {settings.logo && (
          // A data: URL chosen by the teacher; next/image adds nothing for it.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.logo} alt="" className="mx-auto mb-2 h-16 w-auto object-contain" />
        )}
        {settings.schoolName && <p className="text-[15pt] font-bold">{settings.schoolName}</p>}
        {settings.examName && <p className="text-[13pt] font-semibold">{settings.examName}</p>}
        <p className="mt-1">
          {l.class} {book.class} · {hi ? (book.titleHindi ?? book.series) : book.series} (
          {l.subject[book.subject]}) · {l.set} {paper.set}
        </p>
        <div className="mt-2 flex flex-wrap justify-between gap-x-6 text-left">
          <span>
            {l.time}: {settings.minutes} {l.minutes}
          </span>
          {settings.date && (
            <span>
              {l.date}: {settings.date}
            </span>
          )}
          <span>
            {l.maxMarks}: {paper.totalMarks}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-x-6 text-left">
          <span>{l.name}: ______________________</span>
          <span>{l.roll}: ________</span>
        </div>
      </header>
      {settings.instructions && (
        <section className="mt-3">
          <p className="font-bold">{l.instructions}</p>
          <p className="whitespace-pre-line">{settings.instructions}</p>
        </section>
      )}
      {paper.sections.map((section) => (
        <section key={section.title} className="mt-5">
          <h2 className="flex break-after-avoid justify-between gap-4 border-b border-black/40 pt-1 pb-1 font-[inherit] text-[12pt] leading-normal font-bold">
            <span>{section.title}</span>
            <span className="shrink-0">({section.subtitle})</span>
          </h2>
          <ol className="mt-2 space-y-3">
            {section.items.map(({ n, question, options, right }) => (
              <li key={question.id} className="break-inside-avoid" data-testid="paper-question">
                <div className="flex gap-2">
                  <span className="shrink-0 font-semibold">{n}.</span>
                  <p className="flex-1 whitespace-pre-line">
                    {question.text}
                    {question.type === 'truefalse' && ` (${l.true} / ${l.false})`}
                  </p>
                  <span className="shrink-0">[{question.marks}]</span>
                </div>
                {question.type === 'mcq' && (
                  <ol className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 pl-6">
                    {options.map((option, i) => (
                      <li key={i}>
                        ({l.options[i]}) {option}
                      </li>
                    ))}
                  </ol>
                )}
                {question.type === 'match' && (
                  <table className="mt-1 ml-6 border-collapse">
                    <tbody>
                      {question.pairs.map((pair, i) => (
                        <tr key={i}>
                          <td className="py-0.5 pr-10">
                            {i + 1}. {pair.left}
                          </td>
                          <td className="py-0.5">
                            ({l.options[i]}) {right[i]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {question.type === 'picture' && (
                  <div aria-hidden className="mt-2 ml-6 h-[60mm] border border-black/60" />
                )}
                {Array.from({ length: answerLines[question.type] ?? 0 }, (_, i) => (
                  <div key={i} aria-hidden className="mt-5 ml-6 border-b border-black/40" />
                ))}
              </li>
            ))}
          </ol>
        </section>
      ))}
      {withKey && (
        <section
          className="mt-10 border-t-2 border-black/40 pt-6 print:mt-0 print:break-before-page print:border-0 print:pt-[4mm]"
          data-testid="answer-key"
        >
          <h2 className="font-[inherit] text-[13pt] leading-normal font-bold">
            {l.key} · {l.set} {paper.set}
          </h2>
          <ol className="mt-2 space-y-1">
            {paper.key.map(({ n, answer }) => (
              <li key={n} className="flex gap-2">
                <span className="w-8 shrink-0 font-semibold">{n}.</span>
                <span className="whitespace-pre-line">{answer}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  )
}
