import { test, expect } from "@playwright/test";

test.describe("Sign-in (Login) — Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
    expect(errors).toHaveLength(0);
  });

  test("page has correct document title", async ({ page }) => {
    await expect(page).toHaveTitle(/login/i);
  });

  test("primary heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: /^login$/i })).toBeVisible();
  });

  test("page renders within 3 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test("no broken images on page load", async ({ page }) => {
    await page.goto("/sign-in");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test("root redirects to sign-in", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
