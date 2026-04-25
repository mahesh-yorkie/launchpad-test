import { test, expect } from "@playwright/test";

test.describe("Sign-in (Login) — UI Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
  });

  test("marketing headline is visible on desktop layout", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /track, schedule, and optimize your pool services/i })).toBeVisible();
  });

  test("subtitle copy is visible", async ({ page }) => {
    await expect(page.getByText(/login to access your account/i)).toBeVisible();
  });

  test("email and password fields are visible", async ({ page }) => {
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
  });

  test("Login submit button is visible and disabled initially", async ({ page }) => {
    const button = page.getByTestId("sign-in-submit");
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("forgot password link is visible", async ({ page }) => {
    await expect(page.getByTestId("sign-in-forgot-password")).toBeVisible();
  });
});
