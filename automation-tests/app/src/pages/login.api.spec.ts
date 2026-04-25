import { test, expect } from "@playwright/test";
import { loginSetNewPasswordData } from "../../../fixtures/mock-data/login-set-new-password.data";

test.describe("Login (set new password) — API Mock Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submits correct payload on success", async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;
    await page.route("**/api/auth/set-password", async (route) => {
      capturedBody = JSON.parse(route.request().postData() || "{}") as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();

    await expect.poll(() => capturedBody).toEqual({
      password: loginSetNewPasswordData.valid.password,
      confirmPassword: loginSetNewPasswordData.valid.confirmPassword,
    });
  });

  test("shows alert on 500 response", async ({ page }) => {
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

    await expect(page.getByRole("alert")).toContainText(loginSetNewPasswordData.api.errorMessage);
  });

  test("shows alert on 404 response", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not Found" }),
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("shows alert when network fails", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => route.abort("failed"));

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("handles slow API response without duplicate submissions", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/auth/set-password", async (route) => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSetNewPasswordData.api.successBody),
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();
    await expect(page.getByRole("status")).toBeVisible();
    expect(callCount).toBe(1);
  });

  test("409 conflict surfaces server message", async ({ page }) => {
    await page.route("**/api/auth/set-password", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ message: loginSetNewPasswordData.api.conflictMessage }),
      });
    });

    await page.getByTestId("password-input").fill(loginSetNewPasswordData.valid.password);
    await page.getByTestId("confirm-password-input").fill(loginSetNewPasswordData.valid.confirmPassword);
    await page.getByTestId("submit-password").click();

    await expect(page.getByRole("alert")).toContainText(loginSetNewPasswordData.api.conflictMessage);
  });
});
