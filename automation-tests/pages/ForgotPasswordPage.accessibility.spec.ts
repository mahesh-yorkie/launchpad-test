import { test, expect } from "@playwright/test";

const ROUTE = "/forgot-password";

test.describe("Forgot password — A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (r) => r.fulfill({ status: 200, body: "{}" }));
    await page.goto(ROUTE);
  });

  test("single h1", async ({ page }) => {
    expect(await page.getByRole("heading", { level: 1 }).count()).toBe(1);
  });

  test("email labeled", async ({ page }) => {
    await expect(page.getByLabel(/email/i).first()).toBeVisible();
  });
});
