import { defineConfig, devices } from "@playwright/test";

const devPort = Number(process.env.PW_DEV_PORT) || 4173;
const baseURL = `http://localhost:${devPort}`;

export default defineConfig({
  testDir: "./automation-tests",
  testMatch: "index.ts",
  /* Specs are bundled via `index.ts` imports; do not auto-discover nested *.spec.ts. */
  testIgnore: /\/app\/src\/.*\.(spec|test)\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 5,
  reporter: [
    [
      "html",
      {
        open: process.env.CI ? "never" : "on-failure",
        outputFolder: "playwright-report",
      },
    ],
    ["list"],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Pro 11"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      BROWSER: "none",
      PW_DEV_PORT: String(devPort),
    },
  },
});
