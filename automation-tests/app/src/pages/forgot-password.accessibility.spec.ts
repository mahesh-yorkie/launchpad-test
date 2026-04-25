import { test, expect } from "@playwright/test";

test.describe("Forgot password — Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
  });

  test("single primary heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("email input exposes label", async ({ page }) => {
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
  });

  test("email field can be focused for keyboard entry", async ({ page }) => {
    const field = page.getByTestId("forgot-email-input");
    await field.focus();
    await expect(field).toBeFocused();
  });
});
