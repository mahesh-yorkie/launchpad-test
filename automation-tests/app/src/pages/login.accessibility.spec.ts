import { test, expect } from "@playwright/test";

test.describe("Login (set new password) — Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("single primary heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("password inputs expose labels", async ({ page }) => {
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm new password/i)).toBeVisible();
  });

  test("password field can be focused for keyboard entry", async ({ page }) => {
    const field = page.getByTestId("password-input");
    await field.focus();
    await expect(field).toBeFocused();
  });

  test("confirm password toggle exposes accessible name", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /show confirm password|hide confirm password/i });
    await expect(toggle).toBeVisible();
  });
});
