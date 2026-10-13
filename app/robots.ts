import type { MetadataRoute } from 'next'

// Static export: metadata routes must be marked static.
export const dynamic = 'force-static'
import { site } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/styleguide/', '/demo-flip/'] },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
