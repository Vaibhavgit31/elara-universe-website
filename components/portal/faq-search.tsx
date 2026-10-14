'use client'

import { Link2, Search } from 'lucide-react'
import { useState } from 'react'
import { Glass } from '@/components/ui/glass'
import { inputClass } from '@/components/ui/form'
import { faqTopicLabel, faqs, type FaqTopic } from '@/content/faq'

const topics = Object.keys(faqTopicLabel) as FaqTopic[]
const matches = (text: string, words: string[]) => words.every((w) => text.includes(w))

/** Every question by topic, each answer at its own #anchor; the search box narrows them down as
 *  you type. The full list is in the server HTML, so anchors work before JavaScript loads. */
export function FaqSearch() {
  const [query, setQuery] = useState('')
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const shown = faqs.filter((f) => matches(`${f.question} ${f.answer}`.toLowerCase(), words))
  return (
    <div>
      <label className="relative block max-w-xl">
        <span className="eyebrow">Search the answers</span>
        <Search aria-hidden size={20} className="absolute bottom-3 left-1 text-forest" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. sample copy, password, QR"
          className={`${inputClass()} pl-8`}
        />
      </label>
      <p role="status" className="mt-3 text-small text-forest">
        {words.length
          ? `${shown.length} of ${faqs.length} answers match.`
          : `${faqs.length} answers.`}
      </p>
      {shown.length === 0 && (
        <p className="mt-6">
          No answer matches that yet.{' '}
          <a href="#ask" className="link font-semibold">
            Ask our team
          </a>{' '}
          instead.
        </p>
      )}
      <div className="mt-6 space-y-10">
        {topics.map((topic) => {
          const items = shown.filter((f) => f.topic === topic)
          if (!items.length) return null
          return (
            <section key={topic} aria-labelledby={`topic-${topic}`}>
              <h2 id={`topic-${topic}`} className="text-h3">
                {faqTopicLabel[topic]}
              </h2>
              <div className="mt-4 grid min-w-0 gap-4">
                {items.map((faq) => (
                  <Glass
                    key={faq.id}
                    id={faq.id}
                    data-testid="faq"
                    className="scroll-mt-[calc(var(--topbar-h)+1.5rem)] p-5 target:ring-2 target:ring-leaf-700 md:p-6"
                  >
                    <h3 className="flex items-start justify-between gap-4 text-lg">
                      {faq.question}
                      <a
                        href={`#${faq.id}`}
                        aria-label={`Link to this answer: ${faq.question}`}
                        className="focus-glow -m-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-forest hover:bg-mint"
                      >
                        <Link2 aria-hidden size={18} />
                      </a>
                    </h3>
                    <p className="mt-2 max-w-prose wrap-anywhere">{faq.answer}</p>
                  </Glass>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
