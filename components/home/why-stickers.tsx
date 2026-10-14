import { BookOpenCheck, MonitorPlay, PenLine, Users } from 'lucide-react'
import { StickerPop } from '@/components/motion/reveal'
import { Glass } from '@/components/ui/glass'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tag } from '@/components/ui/tag'
import { whyNotes, type WhyNote } from '@/content/home'
import { cn } from '@/lib/cn'

/** Sticker tint and icon per note tone (subject colours stay on small things). */
const looks: Record<WhyNote['tone'], { tint: string; Icon: typeof BookOpenCheck }> = {
  mist: { tint: 'bg-mist', Icon: BookOpenCheck },
  hindi: { tint: 'bg-hindi-tint', Icon: PenLine },
  computer: { tint: 'bg-computer-tint', Icon: MonitorPlay },
  drawing: { tint: 'bg-drawing-tint', Icon: Users },
}

/** Each sticker leans a little its own way, like it was pressed on by hand. */
const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

/** Why schools choose Elara: four die-cut notebook stickers pressed onto a glass panel. */
export function WhyStickers() {
  return (
    <>
      <SectionHeading
        eyebrow="For principals and teachers"
        title="Why schools choose"
        accent="Elara"
      />
      <Glass radius="lg" className="mt-10 p-6 md:p-8">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyNotes.map((note, i) => {
            const { tint, Icon } = looks[note.tone]
            return (
              <li key={note.title}>
                <StickerPop delay={i * 0.08} className="h-full">
                  <div
                    className={cn(
                      'h-full rounded-md border-4 border-white p-5 shadow-lift transition-transform duration-500 hover:rotate-0 motion-reduce:transition-none',
                      tint,
                      tilts[i % tilts.length],
                    )}
                  >
                    <Icon aria-hidden size={28} className="text-forest" />
                    <h3 className="mt-3 font-hand text-2xl leading-8 font-normal">{note.title}</h3>
                    <p className="mt-2 text-small">{note.text}</p>
                    {note.soon && <Tag className="mt-4">{note.soon}</Tag>}
                  </div>
                </StickerPop>
              </li>
            )
          })}
        </ul>
      </Glass>
    </>
  )
}
