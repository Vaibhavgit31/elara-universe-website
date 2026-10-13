import Image from 'next/image'
import { WashiTape } from '@/components/ui/washi-tape'
import type { Person } from '@/content/team'
import { cn } from '@/lib/cn'

/** Illustrated initials on cream with a sprig of the logo's leaves, until a photo arrives. */
const InitialsAvatar = ({ name }: { name: string }) => (
  <svg
    viewBox="0 0 200 200"
    className="h-full w-full"
    role="img"
    aria-label={`${name}, illustrated avatar`}
  >
    <rect width="200" height="200" fill="#EEF3EA" />
    <circle cx="100" cy="104" r="62" fill="#DCE5D2" />
    <path d="M124 56c-6-20 8-38 26-40-2 20-10 34-26 40Z" fill="#8A9A74" />
    <path d="M130 58c10-12 26-14 38-6-12 10-26 12-38 6Z" fill="#B68235" />
    <text
      x="100"
      y="124"
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontSize="56"
      fontWeight="700"
      fill="#3F5645"
    >
      {name
        .split(' ')
        .map((part) => part[0])
        .join('')}
    </text>
  </svg>
)

/** A polaroid held to the page with washi tape. */
export function Polaroid({ person, className }: { person: Person; className?: string }) {
  return (
    <figure className={cn('relative w-60 bg-paper p-3 pb-5 shadow-lift', className)}>
      <WashiTape className="-rotate-3" />
      <div className="aspect-square overflow-hidden bg-mist">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        ) : (
          <InitialsAvatar name={person.name} />
        )}
      </div>
      <figcaption className="mt-3 text-center">
        <span className="block font-hand text-2xl leading-tight">{person.name}</span>
        <span className="eyebrow">{person.role}</span>
      </figcaption>
    </figure>
  )
}
