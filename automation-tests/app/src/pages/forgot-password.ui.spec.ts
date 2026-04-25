import { test, expect } from "@playwright/test";

test.describe("Forgot password — UI Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
  });

  test("marketing headline is visible on desktop layout", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /track, schedule, and optimize your pool services/i })).toBeVisible();
  });

  test("primary form heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /forgot your password/i })).toBeVisible();
  });

  test("email field is visible", async ({ page }) => {
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
  });

  test("Confirm submit button is visible", async ({ page }) => {
    const button = page.getByTestId("forgot-submit");
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("supporting copy is visible", async ({ page }) => {
    await expect(page.getByText(/initiate the password reset process/i)).toBeVisible();
  });

  test("return link is visible", async ({ page }) => {
    await expect(page.getByTestId("forgot-return-to-login")).toBeVisible();
  });
});
