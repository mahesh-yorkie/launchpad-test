import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

test.describe("Login (Set password) — Smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
    await page.waitForLoadState("domcontentloaded");
  });

  test("no unhandled app console errors (excluding font/network)", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const t = msg.text();
        if (t.includes("fonts.gstatic.com") || t.includes("favicon")) return;
        errors.push(t);
      }
    });
    await page.goto(ROUTE);
    await expect.poll(() => errors, { timeout: 2000 }).toEqual([]);
  });

  test("has expected document title", async ({ page }) => {
    await expect(page).toHaveTitle(/Current/);
  });

  test("primary h1 in card is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /set your new password/i, level: 1 }),
    ).toBeVisible();
  });

  test("renders within 3s", async ({ page }) => {
    const start = Date.now();
    await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test("raster/vector images in layout resolve", async ({ page }) => {
    const assets = page.locator(
      "img, svg",
    );
    const count = await assets.count();
    for (let i = 0; i < count; i++) {
      const box = await assets.nth(i).evaluate((el) => {
        if (el instanceof HTMLImageElement) {
          return { w: el.naturalWidth, h: el.naturalHeight };
        }
        const b = (el as SVGElement).getBoundingClientRect();
        return { w: b.width, h: b.height };
      });
      expect((box as { w: number }).w, `asset ${i}`).toBeGreaterThan(0);
    }
  });
});
