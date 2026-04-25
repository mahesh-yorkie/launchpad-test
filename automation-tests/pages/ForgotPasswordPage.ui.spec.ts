import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../fixtures/mock-data/forgot-password.data";

const ROUTE = "/forgot-password";

test.describe("Forgot password — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(forgotPasswordData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
  });

  test("sidebar and main render", async ({ page }) => {
    await expect(page.getByTestId("forgot-password-frame")).toBeVisible();
    await expect(page.getByTestId("forgot-auth-main")).toBeVisible();
  });

  test("email, confirm, return link present", async ({ page }) => {
    await expect(page.getByTestId("forgot-input-email")).toBeVisible();
    await expect(page.getByTestId("forgot-submit")).toBeVisible();
    await expect(page.getByTestId("forgot-return-login")).toBeVisible();
  });
});
