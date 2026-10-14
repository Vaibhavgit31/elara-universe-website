import { ReportBadge } from '@/components/classroom/report-badge'
import { Main } from '@/components/frame/main'
import { QrDoor } from '@/components/illustrations/qr-door'
import { Elu } from '@/components/mascot/elu'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { subjectLabel, type Series } from '@/content/series'

const message =
  'Scanned a QR code from your book? Your learning corner is being set up. Check back soon!'

/** The QR Corner placeholder page, shared by /resources and every /resources/<series>/<class>. */
export function QrCorner({ series, cls }: { series?: Series; cls?: number }) {
  const heading =
    series && cls
      ? { title: series.name, accent: `Class ${cls}`, crayon: series.subject }
      : { title: 'Your learning', accent: 'corner', crayon: 'leaf' as const }
  return (
    <Main>
      <Section className="grid items-center gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="QR Corner"
            {...heading}
            lead={
              <div className="space-y-2">
                {series?.nameHindi && (
                  <p lang="hi" className="font-devanagari text-h3 font-semibold">
                    {series.nameHindi}
                  </p>
                )}
                <p>{message}</p>
              </div>
            }
          />
          {series && cls && (
            // [PLACEHOLDER] wording of the two badge labels
            <div className="mt-8 flex flex-wrap gap-4">
              <ReportBadge label="Class" value={String(cls)} tone="brass" />
              <ReportBadge
                label="Subject"
                value={subjectLabel[series.subject]}
                tone={series.subject}
              />
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Back to the home page</Button>
            {series && (
              <Button href={`/catalog?subject=${series.subject}`} variant="secondary">
                See the {series.name} books
              </Button>
            )}
          </div>
        </div>
        <Glass
          radius="lg"
          className="w-full max-w-md justify-self-center p-6 md:justify-self-end md:p-8"
        >
          <QrDoor className="h-auto w-full" />
          <Elu
            pose="phone"
            label="Elu holding a phone"
            className="absolute -bottom-3 -left-2 w-24 sm:w-32"
          />
        </Glass>
      </Section>
    </Main>
  )
}
