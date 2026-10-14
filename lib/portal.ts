import { books, type Book } from '@/content/books'
import { series, subjectLabel, type Series, type Subject } from '@/content/series'
import type { ClassNumber, Profile } from '@/lib/data/types'

// Web Support rules shared by the portal pages: which subjects and classes a person may open
// (admins everything, teachers what an admin assigned them) and the "Select your title" choice
// that lives in the URL (?subject=hindi&series=basic-hindi-reader).

export const allSubjects = Object.keys(subjectLabel) as Subject[]
export const allClasses: ClassNumber[] = [1, 2, 3, 4, 5, 6, 7, 8]

export const subjectsFor = (p: Profile) => (p.role === 'admin' ? allSubjects : p.subjects)
export const classesFor = (p: Profile) =>
  p.role === 'admin' ? allClasses : [...p.classes].sort((a, b) => a - b)

/** May this person open the book's resources and make a test from it? */
export const canSeeBook = (p: Profile, book: Pick<Book, 'subject' | 'class'>) =>
  subjectsFor(p).includes(book.subject) && classesFor(p).includes(book.class as ClassNumber)

export const seriesForSubject = (subject: Subject) => series.filter((s) => s.subject === subject)
export const seriesOfBook = (book: Pick<Book, 'series'>) =>
  series.find((s) => s.name === book.series)!

/** Web Support link to a series' books, e.g. back from a book's resources. */
export const titleHref = ({ subject, slug }: Pick<Series, 'subject' | 'slug'>) =>
  `/web-support?subject=${subject}&series=${slug}`

/**
 * The title picked in the URL, limited to what the person may see: an unknown or forbidden
 * subject falls back to their first one, a series from another subject to that subject's first.
 */
export function pickTitle(p: Profile, query: { subject?: string; series?: string }) {
  const subjects = subjectsFor(p)
  const subject = subjects.find((s) => s === query.subject) ?? subjects[0]
  if (!subject) return null
  const options = seriesForSubject(subject)
  const chosen = options.find((s) => s.slug === query.series) ?? options[0]
  const classes = classesFor(p)
  const shelf = books.filter(
    (b) => b.series === chosen.name && classes.includes(b.class as ClassNumber),
  )
  return { subjects, subject, options, series: chosen, books: shelf }
}
