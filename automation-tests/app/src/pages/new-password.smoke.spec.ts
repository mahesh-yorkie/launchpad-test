import { test, expect } from "@playwright/test";

test.describe("New password — smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new-password");
    await page.waitForLoadState("networkidle");
  });

  test("page loads with no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/new-password");
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Current/);
  });

  test("has primary heading in hero", async ({ page }) => {
    await expect(
      page.getByTestId("auth-hero-heading"),
    ).toBeVisible();
  });

  test("renders within 3s", async ({ page }) => {
    const t0 = Date.now();
    await page.goto("/new-password");
    await page.waitForLoadState("domcontentloaded");
    expect(Date.now() - t0).toBeLessThan(3000);
  });

  test("no broken images", async ({ page }) => {
    const images = page.locator("img");
    const n = await images.count();
    for (let i = 0; i < n; i += 1) {
      const w = await images.nth(i).evaluate(
        (img: HTMLImageElement) => img.naturalWidth,
      );
      expect(w).toBeGreaterThan(0);
    }
  });
});
