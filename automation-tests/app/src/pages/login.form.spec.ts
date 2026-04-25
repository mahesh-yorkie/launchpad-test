import { test, expect } from "@playwright/test";
import { loginSetNewPasswordData } from "../../../fixtures/mock-data/login-set-new-password.data";

test.describe("Login (set new password) — Form Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submit stays disabled until password rules pass", async ({ page }) => {
    const submit = page.getByTestId("submit-password");
    await page.getByTestId("password-input").fill(loginSetNewPasswordData.invalid.weakPassword);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.invalid.weakPassword);
    await expect(submit).toBeDisabled();
  });

  test("submit disabled when passwords do not match", async ({ page }) => {
    const submit = page.getByTestId("submit-password");
    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.invalid.wrongConfirm);
    await expect(submit).toBeDisabled();
  });

  test("valid passwords enable submit", async ({ page }) => {
    const submit = page.getByTestId("submit-password");
    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await expect(submit).toBeEnabled();
  });

  test("successful submit shows confirmation state", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();
    await expect(page.getByRole("status")).toContainText(/password updated/i);
  });

  test("whitespace-only password keeps submit disabled", async ({ page }) => {
    await page.getByTestId("password-input").fill(loginSetNewPasswordData.edge.whitespaceOnly);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.edge.whitespaceOnly);
    await expect(page.getByTestId("submit-password")).toBeDisabled();
  });

  test("long valid password can be submitted", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    const pwd = loginSetNewPasswordData.edge.longPassword;
    await page.getByTestId("password-input").fill(pwd);
    await page.getByTestId("confirm-password-input").fill(pwd);
    await page.getByTestId("submit-password").click();
    await expect(page.getByRole("status")).toContainText(/password updated/i);
  });

  test("special characters in password are accepted when rules pass", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    const pwd = loginSetNewPasswordData.edge.xssLike;
    await page.getByTestId("password-input").fill(pwd);
    await page.getByTestId("confirm-password-input").fill(pwd);
    await page.getByTestId("submit-password").click();
    await expect(page.getByRole("status")).toContainText(/password updated/i);
  });
});
