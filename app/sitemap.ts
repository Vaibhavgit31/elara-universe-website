import type { MetadataRoute } from 'next'

// Static export: metadata routes must be marked static.
export const dynamic = 'force-static'
import { books } from '@/content/books'
import { series } from '@/content/series'
import { site } from '@/content/site'

const pages = ['/', '/catalog/', '/about/', '/events/', '/contact/', '/resources/', '/web-support/']
const classes = [1, 2, 3, 4, 5, 6, 7, 8]

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [
    ...pages,
    ...books.map((b) => `/catalog/${b.slug}/`),
    ...series.flatMap((s) => classes.map((c) => `/resources/${s.id}/${c}/`)),
  ]
  return urls.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
