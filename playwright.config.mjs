import { defineConfig, devices } from '@playwright/test'

/* Dedicated port so e2e does not pick up a proxy or unrelated process on 5173. */
const port = process.env.E2E_PORT ?? '5180'
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? `http://localhost:${port}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx vite --port ${port} --host 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
