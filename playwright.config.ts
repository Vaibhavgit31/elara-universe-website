import { defineConfig, devices } from '@playwright/test'

const desktop = { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }

// Tests run against the production static export in out/ (npm run build first).
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: desktop },
    { name: 'tablet', use: { ...desktop, viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 740 } } },
    { name: 'reduced-motion', use: { ...desktop, contextOptions: { reducedMotion: 'reduce' } } },
  ],
  webServer: {
    command: 'npx serve out -l 3000 --no-clipboard',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
