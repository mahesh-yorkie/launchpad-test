import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
/** Dedicated test port to avoid clashing with a developer's existing Vite on 5173. */
const port = String(process.env.E2E_PORT || process.env.VITE_DEV_PORT || 5190)
const baseURL = `http://127.0.0.1:${port}`

/**
 * Serves the Vite `app` root (see `vite.config.js`); port is overridable for CI/parallel.
 */
export default defineConfig({
  testDir: path.join(__dirname, 'e2e'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
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
    command: `E2E_STRICT_PORT=1 VITE_DEV_PORT=${port} npm run dev`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
