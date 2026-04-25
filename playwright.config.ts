import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

// Do not read `process.env.PORT` — it is often set by the host to unrelated services.
const devPort = Number.parseInt(
  process.env.PW_DEV_PORT ?? process.env.VITE_DEV_PORT ?? '5180',
  10,
)
// Use `localhost` so tests don't hit a stale service bound only to 127.0.0.1
const baseURL = `http://localhost:${devPort}`

const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '0', 10)
if (nodeMajor < 18) {
  throw new Error(
    `Playwright requires Node.js 18+. Current: ${process.version}.`,
  )
}

/**
 * E2E tests: `automation-tests/`, import entry `automation-tests/index.ts`.
 * Dev server must match the port the bundle uses (Vite: 5173 by default).
 */
export default defineConfig({
  testDir: './automation-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'], viewport: { width: 390, height: 844 } },
    },
    { name: 'tablet', use: { ...devices['iPad Pro'], viewport: { width: 768, height: 1024 } } },
  ],
  webServer: {
    command: 'npm run start -w app',
    cwd: here,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      BROWSER: 'none',
      VITE_DEV_PORT: String(devPort),
    },
  },
  outputDir: 'test-results',
})
