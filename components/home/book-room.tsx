import { Check } from 'lucide-react'
import { ReportBadge } from '@/components/classroom/report-badge'
import { ClassPicker } from '@/components/home/class-picker'
import { Button } from '@/components/ui/button'
import { buttonClass } from '@/components/ui/button-class'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/tag'
import { books } from '@/content/books'
import { series } from '@/content/series'
import { site, whatsappLink } from '@/content/site'

/** Room name per series, as the eyebrow reads it: "Our books · Hindi class". */
const rooms = { hindi: 'Hindi class', technova: 'Computer lab', 'art-journey': 'Art room' } as const

export type BookRoomId = keyof typeof rooms

/** One book room: the series story on the left, the class picker with its cover on the right. */
export function BookRoom({ seriesId }: { seriesId: BookRoomId }) {
  const s = series.find((x) => x.id === seriesId) ?? series[0]
  // Features and support are the same for every class of a series, so the first book speaks.
  const book = books.find((b) => b.series === s.name)
  const features = book?.features.slice(0, 5) ?? []
  const support = book?.support ?? []
  // The last word of the name takes the crayon underline; a one-word name (TechNova) gets none.
  const cut = s.name.lastIndexOf(' ')
  const title = cut > 0 ? s.name.slice(0, cut) : s.name
  const accent = cut > 0 ? s.name.slice(cut + 1) : undefined

  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16" data-room-series={s.id}>
      <div>
        <SectionHeading
          eyebrow={`Our books · ${rooms[seriesId]}`}
          title={title}
          accent={accent}
          crayon={s.subject}
        />
        {s.nameHindi && (
          <p lang="hi" className="mt-2 font-devanagari text-h3 font-semibold text-forest">
            {s.nameHindi}
          </p>
        )}
        <p className="mt-3 font-hand text-2xl text-forest">{s.tagline}</p>
        <p className="mt-4 max-w-prose">{s.blurb}</p>
        {features.length > 0 && (
          <>
            {/* [PLACEHOLDER] wording: label from the "What's inside" note in content/books.ts */}
            <p className="mt-8 eyebrow">What&apos;s inside</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check aria-hidden size={20} className="mt-1 shrink-0 text-leaf-700" />
                  {feature}
                </li>
              ))}
            </ul>
          </>
        )}
        {support.length > 0 && (
          <>
            {/* [PLACEHOLDER] wording */}
            <p className="mt-6 eyebrow">Comes with</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {support.map((item) => (
                <li key={item}>
                  <Tag tone={s.subject}>{item}</Tag>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <ReportBadge label="NEP 2020" value="Aligned" />
          <ReportBadge label="Classes" value="1–8" tone="brass" />
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={`/catalog?subject=${s.subject}`}>See all {s.name} books</Button>
          {/* [PLACEHOLDER] wording of the WhatsApp message */}
          <a
            href={whatsappLink(
              `Hello ${site.shortName}, I would like to know more about ${s.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('secondary')}
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
      <ClassPicker seriesId={s.id} />
    </div>
  )
}
