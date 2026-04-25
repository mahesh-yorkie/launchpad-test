import { test, expect } from "@playwright/test";
import { loginSetNewPasswordData } from "../../../fixtures/mock-data/login-set-new-password.data";

test.describe("Login (set new password) — Edge Cases", () => {
  test("return link navigates to sign-in", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("return-to-login").click();
    await expect(page).toHaveURL(/\/sign-in$/);
    await expect(page.getByRole("heading", { level: 1, name: /^login$/i })).toBeVisible();
  });

  test("browser back returns to login screen", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("return-to-login").click();
    await expect(page).toHaveURL(/\/sign-in$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("double submit does not send duplicate requests", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/auth/set-password", async (route) => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    await page.goto("/login");
    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    const button = page.getByTestId("submit-password");
    await button.dblclick();

    await expect.poll(() => callCount, { timeout: 5_000 }).toBe(1);
  });

  test("auth shell fits large desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/login");
    const shell = page.getByTestId("auth-shell");
    const box = await shell.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(1200);
  });

  test("unicode password satisfies complexity when matched", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    const pwd = loginSetNewPasswordData.edge.unicodePassword;
    await page.goto("/login");
    await page.getByTestId("password-input").fill(pwd);
    await page.getByTestId("confirm-password-input").fill(pwd);
    await page.getByTestId("submit-password").click();
    await expect(page.getByRole("status")).toBeVisible();
  });
});
