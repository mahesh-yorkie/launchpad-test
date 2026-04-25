import { defineConfig, devices } from "@playwright/test";

const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
if (nodeMajor < 18) {
  throw new Error(
    `Playwright requires Node.js 18+. Current: ${process.version}. ` +
      "Use Node 20 LTS and retry.",
  );
}

const devPort = Number(
  process.env.PW_DEV_PORT ?? process.env.VITE_DEV_PORT ?? "5174",
);
const baseURL = `http://localhost:${devPort}`;

export default defineConfig({
  testDir: "./automation-tests",
  testMatch: "index.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 5,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      BROWSER: "none",
      VITE_DEV_PORT: String(devPort),
    },
  },
});
