import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../../../fixtures/mock-data/forgot-password.data";

test.describe("Forgot password — Edge Cases", () => {
  test("return link navigates to sign-in", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByTestId("forgot-return-to-login").click();
    await expect(page).toHaveURL(/\/sign-in$/);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("browser back returns to forgot password screen", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByTestId("forgot-return-to-login").click();
    await expect(page).toHaveURL(/\/sign-in$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test("double submit does not send duplicate requests", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/auth/forgot-password", async (route) => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(forgotPasswordData.api.successBody),
      });
    });

    await page.goto("/forgot-password");
    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    const button = page.getByTestId("forgot-submit");
    await button.dblclick();

    await expect.poll(() => callCount, { timeout: 5_000 }).toBe(1);
  });

  test("auth shell fits large desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/forgot-password");
    const shell = page.getByTestId("auth-shell");
    const box = await shell.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(1200);
  });

  test("sign-in exposes forgot password entry point", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByTestId("go-to-forgot-password")).toBeVisible();
  });
});
