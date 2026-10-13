import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes the whole site to out/ for drag-and-drop hosting.
  output: 'export',
  // /about/index.html instead of /about.html, so every static host serves it without rewrites.
  trailingSlash: true,
  // Images are pre-optimised to WebP by scripts/ (Phase 2); no image server exists on a static host.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
}

export default nextConfig
