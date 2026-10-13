import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QrCorner } from '@/components/resources/qr-corner'
import { series } from '@/content/series'

// The addresses printed in the books: /resources/<series>/<class>, series hindi | technova |
// art-journey, class 1–8. They must never break, so all 24 are generated here. To send one to
// another website later, add a redirect in public/_redirects (Netlify) or vercel.json (Vercel).
const classes = ['1', '2', '3', '4', '5', '6', '7', '8']
type Props = { params: Promise<{ series: string; class: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  series.flatMap((s) => classes.map((cls) => ({ series: s.id, class: cls })))

const resolve = async (params: Props['params']) => {
  const { series: id, class: cls } = await params
  const found = series.find((s) => s.id === id)
  return found && classes.includes(cls) ? { series: found, cls: Number(cls) } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const match = await resolve(params)
  return { title: match ? `QR Corner · ${match.series.name} Class ${match.cls}` : 'QR Corner' }
}

export default async function ResourcePage({ params }: Props) {
  const match = await resolve(params)
  if (!match) notFound()
  return <QrCorner series={match.series} cls={match.cls} />
}
