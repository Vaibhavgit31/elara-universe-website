import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AccountPanel } from '@/components/admin/account-panel'
import { TeacherForm } from '@/components/admin/teacher-form'
import { Main } from '@/components/frame/main'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { requireAdmin } from '@/lib/auth/session'
import { getStore } from '@/lib/data/store'

export const metadata: Metadata = { title: 'Admin', robots: { index: false } }

type Props = { params: Promise<{ id: string }> }

/** One account: edit the details on the left, manage the account itself on the right. */
export default async function TeacherPage({ params }: Props) {
  const { id } = await params
  const admin = await requireAdmin(`/admin/teachers/${id}`)
  const profile = await (await getStore()).getProfile(id)
  if (!profile) notFound()
  return (
    <Main>
      <Section className="py-12 md:py-16">
        <SectionHeading as="h1" eyebrow="Teacher" title={profile.name} lead={profile.email} />
        <Button href="/admin" variant="ghost" className="mt-6">
          <ArrowLeft aria-hidden size={18} /> Back to Admin
        </Button>
      </Section>
      <Section className="grid items-start gap-8 pb-16 md:grid-cols-[1.3fr_1fr]">
        <Glass radius="lg" className="p-6 sm:p-8">
          <h2>Details</h2>
          <TeacherForm profile={profile} />
        </Glass>
        <Glass radius="lg" className="p-6 sm:p-8">
          <AccountPanel profile={profile} self={profile.id === admin.id} />
        </Glass>
      </Section>
    </Main>
  )
}
