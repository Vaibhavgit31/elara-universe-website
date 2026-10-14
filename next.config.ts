import type { NextConfig } from 'next'

// Phase 2: a Node.js server build for Vercel (server routes, Server Actions, the proxy). The
// static export from Phase 1 is gone; see docs/research/nextjs16-vercel.md §4 and
// https://nextjs.org/docs/app/guides/static-exports#unsupported-features for what that unlocks.
const nextConfig: NextConfig = {
  // /about/ instead of /about, so every Phase 1 link and the printed QR addresses keep working.
  trailingSlash: true,
  // Covers and samples are pre-optimised WebP files at their display sizes (scripts/), so the
  // runtime image optimiser is not needed and its Vercel quota is never used.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
}

export default nextConfig
