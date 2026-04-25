import { test, expect } from "@playwright/test";
import { loginSetNewPasswordData } from "../../../fixtures/mock-data/login-set-new-password.data";

test.describe("Login (set new password) — Error & Negative Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("error clears after user edits password", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: loginSetNewPasswordData.api.errorMessage }),
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();
    await expect(page.getByRole("alert")).toBeVisible();

    await page.getByTestId("password-input").fill(`${loginSetNewPasswordData.valid.password}z`);
    await expect(page.getByRole("alert")).not.toBeAttached();
  });

  test("malformed success body still completes without crash", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "not-json",
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();

    await expect(page.getByRole("alert")).toContainText(/malformed response/i);
  });
});
