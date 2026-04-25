import { test, expect } from "@playwright/test";

const ROUTE = "/new-password";

test.describe("New password — smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(ROUTE);
    await page.waitForLoadState("load");
    expect(errors).toHaveLength(0);
  });

  test("page has document title for Current", async ({ page }) => {
    await expect(page).toHaveTitle(/Current/i);
  });

  test("primary heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /set your new password/i })).toBeVisible();
  });

  test("page shell renders at interactive speed", async ({ page }) => {
    const start = Date.now();
    await page.goto(ROUTE);
    await page.waitForLoadState("domcontentloaded");
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test("branded and logo images render", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const w = await images.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(w).toBeGreaterThan(0);
    }
  });
});
