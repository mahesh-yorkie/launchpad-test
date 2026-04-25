import { test, expect } from "@playwright/test";

const ROUTE = "/login";

test.describe("Login — Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
    );
    await page.goto(ROUTE);
  });

  test("one h1 on page", async ({ page }) => {
    expect(await page.getByRole("heading", { level: 1 }).count()).toBe(1);
  });

  test("primary inputs are labeled", async ({ page }) => {
    await expect(page.getByLabel(/Password/i).first()).toBeVisible();
    await expect(page.getByLabel(/Confirm New Password/i)).toBeVisible();
  });

  test("toggle for confirm has accessible name", async ({ page }) => {
    const btn = page.getByTestId("toggle-confirm-visibility");
    const name = await btn.getAttribute("aria-label");
    expect(name).toBeTruthy();
  });

  test("images have alt or decorative purpose", async ({ page }) => {
    const images = page.locator("img");
    const c = await images.count();
    for (let i = 0; i < c; i++) {
      const el = images.nth(i);
      const alt = await el.getAttribute("alt");
      expect(alt, `img ${i}`).not.toBeNull();
    }
  });
});
