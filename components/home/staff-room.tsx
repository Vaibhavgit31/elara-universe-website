import { Polaroid } from '@/components/about/polaroid'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { series } from '@/content/series'
import { site } from '@/content/site'
import { team } from '@/content/team'
import { cn } from '@/lib/cn'

const list = new Intl.ListFormat('en-IN', { type: 'conjunction' })
/** The city is the second item of each address's second line (content/site.ts). */
const cityOf = (address: (typeof site.addresses)[number]) => address.lines[1].split(', ')[1]
const screws = [
  [12, 12],
  [148, 12],
  [12, 44],
  [148, 44],
]

/** A hand-lettered "Staff room" door sign on a cream plaque with four brass screws. */
const DoorSign = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 160 56" className={cn('h-auto w-40', className)}>
    <rect
      x="2"
      y="2"
      width="156"
      height="52"
      rx="8"
      className="fill-cream stroke-brass"
      strokeWidth="3"
    />
    {screws.map(([cx, cy]) => (
      <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3" className="fill-brass" />
    ))}
    <text
      x="80"
      y="37"
      textAnchor="middle"
      fontSize="26"
      letterSpacing="1"
      className="fill-forest font-hand"
    >
      Staff room
    </text>
  </svg>
)

/** Staff room: who makes the books, with the founders' polaroids taped to a glass panel. */
export function StaffRoom() {
  const [registered, office] = site.addresses
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
      <div>
        <SectionHeading
          eyebrow="Staff room"
          title="The people behind the"
          accent="books"
          crayon="leaf"
        />
        {/* [PLACEHOLDER] wording; every fact comes from content/site.ts and content/series.ts */}
        <p className="mt-4 max-w-prose">
          {site.name} publishes {list.format(series.map((s) => s.name))} — {site.tagline} The
          company has its {registered.label.toLowerCase()} in {cityOf(registered)} and an{' '}
          {office.label.toLowerCase()} in {cityOf(office)}, and is led by its co-founders,{' '}
          {list.format(site.founders)}.
        </p>
        <p className="mt-3 font-hand text-xl text-forest">{site.curriculum}</p>
        <Button href="/about" variant="secondary" className="mt-8">
          Our story
        </Button>
      </div>
      <Glass radius="lg" className="p-6 pt-14 md:p-8 md:pt-16">
        <DoorSign className="absolute -top-5 left-6 -rotate-2" />
        <ul className="flex flex-wrap justify-center gap-6">
          {team.map((person, i) => (
            <li key={person.name}>
              <Polaroid
                person={person}
                className={cn('w-52', i % 2 ? 'rotate-2 sm:mt-6' : '-rotate-2')}
              />
            </li>
          ))}
        </ul>
      </Glass>
    </div>
  )
}
