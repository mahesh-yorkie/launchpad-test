import { defineConfig, devices } from "@playwright/test";

const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
if (nodeMajor < 18) {
  throw new Error(
    `Playwright requires Node.js 18+. Current: ${process.version}. ` +
      `Use Node 20 LTS and retry.`,
  );
}

const devPort = Number.parseInt(process.env.PW_DEV_PORT ?? "5173", 10);
const baseURL = `http://localhost:${devPort}`;

export default defineConfig({
  testDir: "./automation-tests",
  testMatch: "index.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 5,
  reporter: [
    ["html", { open: process.env.CI ? "never" : "always", outputFolder: "playwright-report" }],
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
      use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Pro"], viewport: { width: 768, height: 1024 } },
    },
  ],
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      BROWSER: "none",
      VITE_API_URL: "http://localhost:5000/api",
      PW_DEV_PORT: String(devPort),
    },
  },
});
