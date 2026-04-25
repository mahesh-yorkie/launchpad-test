import { test, expect } from "@playwright/test";

test.describe("Login (set new password) — UI Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("marketing headline is visible on desktop layout", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /track, schedule, and optimize your pool services/i })).toBeVisible();
  });

  test("primary form heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /set your new password/i })).toBeVisible();
  });

  test("password fields are visible", async ({ page }) => {
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm new password/i)).toBeVisible();
  });

  test("Login submit button is visible", async ({ page }) => {
    const button = page.getByTestId("submit-password");
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("password requirement checklist renders", async ({ page }) => {
    await expect(page.getByText(/minimum 8 characters/i)).toBeVisible();
    await expect(page.getByText(/at least 1 uppercase letter/i)).toBeVisible();
    await expect(page.getByText(/at least 1 number/i)).toBeVisible();
    await expect(page.getByText(/at least 1 special character/i)).toBeVisible();
  });

  test("return link is visible", async ({ page }) => {
    await expect(page.getByTestId("return-to-login")).toBeVisible();
  });
});
