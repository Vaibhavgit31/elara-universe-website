import 'server-only'

import { books } from '@/content/books'
import { faqs, type Faq } from '@/content/faq'
import { site } from '@/content/site'
import { isoToday, splitEvents, formatDate } from '@/lib/events'
import { clean } from '@/lib/chat/knowledge'

// Link buttons under Elu's answers, chosen on the server from the question by plain keyword
// rules, never written by the model: every href comes from this file, so a link can never point
// anywhere the site does not have (written with the site's trailing slash). The same rules give
// the mock-mode answers.

export type ChatLink = { label: string; href: string; kind?: 'ask' }

const stop = new Set(
  'a an and are can do does for how i in is it me my of on or the this to what when where which who why with you your elara universe book books'.split(
    ' ',
  ),
)
const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1 && !stop.has(w))

/** The FAQ entry that shares the most words with the question (two at least). */
export function bestFaq(question: string): Faq | undefined {
  const asked = new Set(words(question))
  const scored = faqs.map((f) => ({
    f,
    score: [...new Set(words(f.question))].filter((w) => asked.has(w)).length,
  }))
  const best = scored.sort((a, b) => b.score - a.score)[0]
  return best && best.score >= 2 ? best.f : undefined
}

const classIn = (text: string) => Number(/\bclass\s*([1-8])\b/i.exec(text)?.[1]) || null

const topics: [RegExp, ChatLink][] = [
  [/\bhindi\b|हिंदी/i, { label: 'Hindi books', href: '/catalog/?subject=hindi' }],
  [/\bcomputer|technova\b/i, { label: 'TechNova books', href: '/catalog/?subject=computer' }],
  [
    /\bdrawing|\bart\b|art journey/i,
    { label: 'Art Journey books', href: '/catalog/?subject=drawing' },
  ],
  [/\bevent|workshop|training|fair|launch/i, { label: 'Events', href: '/events/' }],
  [
    /sample|order|price|cost|buy|purchase|mrp/i,
    { label: 'Request a sample copy', href: '/contact/' },
  ],
  [
    /web ?support|login|log in|sign in|access|password|portal/i,
    { label: 'Web Support', href: '/web-support/' },
  ],
  [/\bqr\b|scan/i, { label: 'QR Corner', href: '/resources/' }],
  [
    /test ?maker|test paper|question paper/i,
    { label: 'About the Test Maker', href: '/web-support/help/#test-maker' },
  ],
  [/contact|phone|call|email|whatsapp|address|office/i, { label: 'Contact', href: '/contact/' }],
  [/about|founder|company|who (are|made)/i, { label: 'About us', href: '/about/' }],
]

export const askTeam = (question: string): ChatLink => ({
  label: 'Ask our team',
  href: `/web-support/help/?q=${encodeURIComponent(question.slice(0, 300))}#ask`,
  kind: 'ask',
})

export const DONT_KNOW = "I don't know that yet."

/** Up to three buttons for the question; "Ask our team" when nothing fits or Elu did not know. */
export function pickLinks(question: string, answer = ''): ChatLink[] {
  const found: ChatLink[] = []
  const faq = bestFaq(question)
  if (faq) found.push({ label: 'Open this answer', href: `/web-support/help/#${faq.id}` })
  const cls = classIn(question)
  if (cls) found.push({ label: `Books for Class ${cls}`, href: `/catalog/?class=${cls}` })
  for (const [pattern, link] of topics) if (pattern.test(question)) found.push(link)
  const unique = found.filter((l, i) => found.findIndex((o) => o.href === l.href) === i).slice(0, 3)
  return !unique.length || answer.includes(DONT_KNOW) ? [...unique, askTeam(question)] : unique
}

/** Mock mode (no xAI key): a short answer from the same content, without any AI. */
export function mockAnswer(question: string): string {
  const cls = classIn(question)
  if (cls) {
    const list = books.filter((b) => b.class === cls).map((b) => b.title)
    return `For Class ${cls} there are ${list.length} books: ${list.join(', ')}. The buttons below open them.`
  }
  if (/\bevent|workshop|fair|launch/i.test(question)) {
    const next = splitEvents(isoToday()).upcoming[0]
    return next
      ? `The next event on the notice board is ${clean(next.title, '')} on ${formatDate(next.date)} in ${next.city}${next.isPlaceholder ? ' (a sample event, not confirmed yet)' : ''}.`
      : 'There are no upcoming events on the notice board right now.'
  }
  const faq = bestFaq(question)
  if (faq) return clean(faq.answer)
  if (topics.some(([pattern]) => pattern.test(question)))
    return `You can find that on the page below, or write to us at ${site.email}.`
  return `${DONT_KNOW} I can help with Elara Universe books and this website. Our team can answer the rest.`
}
