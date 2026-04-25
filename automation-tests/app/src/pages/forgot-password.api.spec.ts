import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../../../fixtures/mock-data/forgot-password.data";

test.describe("Forgot password — API Mock Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submits correct payload on success", async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;
    await page.route("**/api/auth/forgot-password", async (route) => {
      capturedBody = JSON.parse(route.request().postData() || "{}") as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(forgotPasswordData.api.successBody),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();

    await expect.poll(() => capturedBody).toEqual({ email: forgotPasswordData.valid.email });
  });

  test("shows alert on 500 response", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: forgotPasswordData.api.errorMessage }),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();

    await expect(page.getByRole("alert")).toContainText(forgotPasswordData.api.errorMessage);
  });

  test("shows alert on 404 response", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not Found" }),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("shows alert when network fails", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => route.abort("failed"));

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("handles slow API response without duplicate submissions", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/auth/forgot-password", async (route) => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(forgotPasswordData.api.successBody),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByRole("status")).toBeVisible();
    expect(callCount).toBe(1);
  });

  test("429 rate limit surfaces server message", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ message: forgotPasswordData.api.rateLimitMessage }),
      });
    });

    await page.getByTestId("forgot-email-input").fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();

    await expect(page.getByRole("alert")).toContainText(forgotPasswordData.api.rateLimitMessage);
  });
});
