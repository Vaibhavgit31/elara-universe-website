'use client'

import { Download, ExternalLink, FileText } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { Flipbook } from '@/components/book/flipbook'
import { Elu } from '@/components/mascot/elu'
import { buttonClass } from '@/components/ui/button-class'
import { Tag } from '@/components/ui/tag'
import type { Book } from '@/content/books'
import {
  resourceKindLabel,
  resourceKinds,
  resourcesFor,
  type ResourceKind,
} from '@/content/resources'
import { cn } from '@/lib/cn'

/** "Coming soon" with the titles that are expected here, so it is clear what will arrive. */
function ComingSoon({ titles }: { titles: string[] }) {
  return (
    <div className="flex items-center gap-6" data-testid="coming-soon">
      <Elu pose="read" label="Elu reading" className="w-20 shrink-0 sm:w-24" />
      <div className="min-w-0">
        <p className="font-hand text-2xl text-forest">Coming soon</p>
        {titles.length > 0 && (
          <ul className="mt-2 space-y-1 text-small text-forest">
            {titles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** One tab's content from content/resources.ts: players, PDFs, quiz links or downloads. */
function Panel({ book, kind }: { book: Book; kind: ResourceKind }) {
  if (kind === 'ebook')
    return book.samples.length ? (
      <>
        <p className="mb-4 text-small text-forest">
          The sample pages for now; the full e-book follows. {/* [PLACEHOLDER] wording */}
        </p>
        <Flipbook pages={book.samples} title={book.title} />
      </>
    ) : (
      <ComingSoon titles={[]} />
    )
  const all = resourcesFor(book.slug, kind)
  const ready = all.filter((r) => r.url)
  if (!ready.length) return <ComingSoon titles={all.map((r) => r.title)} />
  return (
    <ul className="grid gap-6">
      {ready.map((r) => (
        <li key={r.url} className="space-y-3">
          <p className="font-semibold">
            {r.title} {r.chapter && <Tag className="ml-2">{r.chapter}</Tag>}
          </p>
          {kind === 'videos' && (
            <iframe
              src={r.url}
              title={r.title}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              className="aspect-video w-full rounded-sm bg-mist"
            />
          )}
          {kind === 'worksheets' && (
            <object
              data={r.url}
              type="application/pdf"
              className="aspect-[1/1.3] w-full rounded-sm bg-mist"
              aria-label={r.title}
            >
              <p className="p-4">This browser cannot show the PDF here; download it instead.</p>
            </object>
          )}
          {kind === 'quizzes' ? (
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('secondary')}
            >
              <ExternalLink aria-hidden size={18} /> Open the quiz
            </a>
          ) : (
            kind !== 'videos' && (
              <a href={r.url} download className={buttonClass('secondary')}>
                {kind === 'worksheets' ? (
                  <FileText aria-hidden size={18} />
                ) : (
                  <Download aria-hidden size={18} />
                )}
                Download
              </a>
            )
          )}
        </li>
      ))}
    </ul>
  )
}

/** The five resource tabs (WAI-ARIA tabs: arrow keys move between them). */
export function ResourceTabs({ book }: { book: Book }) {
  const [active, setActive] = useState<ResourceKind>('ebook')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: resourceKinds.length - 1 - i }[
      e.key
    ]
    if (step === undefined) return
    e.preventDefault()
    const next = (i + step + resourceKinds.length) % resourceKinds.length
    setActive(resourceKinds[next])
    tabs.current[next]?.focus()
  }
  return (
    <div>
      <div role="tablist" aria-label="Learning resources" className="flex flex-wrap gap-2">
        {resourceKinds.map((kind, i) => (
          <button
            key={kind}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`tab-${kind}`}
            aria-selected={active === kind}
            aria-controls={`panel-${kind}`}
            tabIndex={active === kind ? 0 : -1}
            onClick={() => setActive(kind)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'focus-glow inline-flex min-h-11 items-center rounded-full px-4 text-small font-semibold transition-colors',
              active === kind ? 'bg-leaf-700 text-white' : 'glass text-forest hover:bg-white/70',
            )}
          >
            {resourceKindLabel[kind]}
          </button>
        ))}
      </div>
      {resourceKinds.map((kind) => (
        <div
          key={kind}
          role="tabpanel"
          id={`panel-${kind}`}
          aria-labelledby={`tab-${kind}`}
          hidden={active !== kind}
          tabIndex={0}
          className="mt-6"
        >
          {active === kind && <Panel book={book} kind={kind} />}
        </div>
      ))}
    </div>
  )
}
