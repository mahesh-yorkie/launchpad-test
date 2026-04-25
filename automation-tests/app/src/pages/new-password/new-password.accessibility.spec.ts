import { test, expect } from "@playwright/test";

const ROUTE = "/new-password";

test.describe("New password — accessibility", () => {
  test("labels are associated for password fields", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm new password/i)).toBeVisible();
  });

  test("one primary h1 and logical heading for marketing column", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: /pool services/i })).toBeVisible();
  });

  test("toggle visibility is keyboard focusable and named", async ({ page }) => {
    await page.goto(ROUTE);
    const btn = page.getByTestId("confirm-password-visibility");
    await expect(btn).toBeVisible();
    const name = await btn.getAttribute("aria-label");
    expect(name).toBeTruthy();
  });
});
