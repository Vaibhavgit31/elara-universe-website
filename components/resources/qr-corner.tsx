import { Main } from '@/components/frame/main'
import { QrDoor } from '@/components/illustrations/qr-door'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { subjectLabel, type Series } from '@/content/series'

/** The QR Corner placeholder page, shared by /resources and every /resources/<series>/<class>. */
export function QrCorner({ series, cls }: { series?: Series; cls?: number }) {
  return (
    <Main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2">
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
        <QrDoor className="w-full max-w-md justify-self-center" />
      </div>
    </Main>
  )
}
