import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../../../fixtures/mock-data/forgot-password.data";

test.describe("Forgot password — Error & Negative Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
  });

  test("error clears after user edits email", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: forgotPasswordData.api.errorMessage }),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByRole("alert")).toBeVisible();

    await page.getByTestId("forgot-email-input").fill("a");
    await expect(page.getByRole("alert")).not.toBeAttached();
  });

  test("malformed success body shows error", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "not-json",
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();

    await expect(page.getByRole("alert")).toContainText(/malformed response/i);
  });
});
