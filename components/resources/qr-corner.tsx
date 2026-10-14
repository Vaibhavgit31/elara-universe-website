import { Main } from '@/components/frame/main'
import { Section } from '@/components/ui/section'
import { QrDoor } from '@/components/illustrations/qr-door'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { subjectLabel, type Series } from '@/content/series'

/** The QR Corner placeholder page, shared by /resources and every /resources/<series>/<class>. */
export function QrCorner({ series, cls }: { series?: Series; cls?: number }) {
  return (
    <Main>
      <Section className="grid items-center gap-10 py-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">QR Corner</p>
          {series && cls ? (
            <>
              <Tag tone={series.subject} className="mt-2">
                {subjectLabel[series.subject]}
              </Tag>
              <h1 className="mt-3">
                {series.name}
                <span className="block text-h2">Class {cls}</span>
                {series.nameHindi && (
                  <span className="block font-devanagari text-h3 font-semibold text-forest">
                    {series.nameHindi}
                  </span>
                )}
              </h1>
            </>
          ) : (
            <h1 className="mt-3">Your learning corner</h1>
          )}
          <p className="mt-5 max-w-md text-lg">
            Scanned a QR code from your book? Your learning corner is being set up. Check back soon!
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Back to the home page</Button>
            {series && (
              <Button href={`/catalog?subject=${series.subject}`} variant="secondary">
                See the {series.name} books
              </Button>
            )}
          </div>
        </div>
        <div className="relative w-full max-w-md justify-self-center">
          <QrDoor className="w-full" />
          <Elu
            pose="phone"
            label="Elu holding a phone"
            className="absolute -bottom-6 -left-4 w-24 sm:w-32"
          />
        </div>
      </Section>
    </Main>
  )
}
