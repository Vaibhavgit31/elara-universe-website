import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { NewTeacherForm } from '@/components/admin/new-teacher-form'
import type { TeacherDefaults } from '@/components/admin/teacher-fields'
import { MockNote } from '@/components/auth/mock-note'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { bookBySlug } from '@/content/books'
import { requireAdmin } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'
import type { AccessRequest } from '@/lib/data/types'

export const metadata: Metadata = { title: 'Admin', robots: { index: false } }

type Props = { searchParams: Promise<{ request?: string }> }

/** The form pre-filled from an access request: its book slug gives the subject. */
const fromRequest = ({ name, school, email, phone, book, class: cls }: AccessRequest) => {
  const found = bookBySlug(book)
  return {
    name,
    school,
    email,
    phone,
    classes: [cls],
    subjects: found ? [found.subject] : [],
  } satisfies TeacherDefaults
}

export default async function NewTeacherPage({ searchParams }: Props) {
  await requireAdmin('/admin/teachers/new')
  const { request: requestId } = await searchParams
  const request = requestId ? await (await getStore()).getRequest(requestId) : null
  return (
    <Main>
      <Section className="grid items-start gap-10 py-12 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-16">
        <div>
          {/* [PLACEHOLDER] wording: the lead lines */}
          <SectionHeading
            as="h1"
            eyebrow="Staff room"
            title="New teacher account"
            crayon="leaf"
            lead={
              request
                ? `Pre-filled from the request by ${request.name}; check the details before creating the account.`
                : 'Accounts are created only here. Send an invite email, or hand over a one-time password in person.'
            }
          />
          <Button href="/admin" variant="ghost" className="mt-6">
            <ArrowLeft aria-hidden size={18} /> Back to Admin
          </Button>
          <div className="mt-8 max-w-md">
            <MockNote />
          </div>
        </div>
        <NewTeacherForm
          defaults={request ? fromRequest(request) : undefined}
          requestId={request?.id}
        />
      </Section>
    </Main>
  )
}
