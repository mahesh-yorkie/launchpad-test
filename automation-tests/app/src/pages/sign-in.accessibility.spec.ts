import { test, expect } from "@playwright/test";

test.describe("Sign-in (Login) — Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
  });

  test("single primary heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("fields expose labels", async ({ page }) => {
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
  });

  test("password visibility toggle has accessible name", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /show password|hide password/i });
    await expect(toggle).toBeVisible();
  });
});
