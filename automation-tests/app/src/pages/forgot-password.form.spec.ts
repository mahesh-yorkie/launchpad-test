import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../../../fixtures/mock-data/forgot-password.data";

test.describe("Forgot password — Form Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submit stays disabled for invalid email", async ({ page }) => {
    const submit = page.getByTestId("forgot-submit");
    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.invalid.email);
    await expect(submit).toBeDisabled();
  });

  test("submit stays disabled for whitespace-only input", async ({ page }) => {
    const submit = page.getByTestId("forgot-submit");
    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.edge.whitespaceOnly);
    await expect(submit).toBeDisabled();
  });

  test("valid email enables submit", async ({ page }) => {
    const submit = page.getByTestId("forgot-submit");
    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await expect(submit).toBeEnabled();
  });

  test("successful submit shows confirmation state", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(forgotPasswordData.api.successBody),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByRole("status")).toContainText(/reset instructions/i);
  });

  test("plus-address email is accepted", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(forgotPasswordData.api.successBody),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.edge.plusTag);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("long local-part email can be submitted", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(forgotPasswordData.api.successBody),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.edge.longLocal);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByRole("status")).toBeVisible();
  });
});
