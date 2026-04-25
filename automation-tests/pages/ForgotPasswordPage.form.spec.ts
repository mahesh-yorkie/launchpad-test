import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../fixtures/mock-data/forgot-password.data";

const ROUTE = "/forgot-password";

test.describe("Forgot password — Form", () => {
  test("submit disabled when email invalid", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/forgot-password", (route) => {
      calls++;
      return route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    await page.getByTestId("forgot-input-email").fill(forgotPasswordData.invalid.email);
    await expect(page.getByTestId("forgot-submit")).toBeDisabled();
    await expect.poll(() => calls, { timeout: 500 }).toBe(0);
  });

  test("valid email submits", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({
        status: 201,
        body: JSON.stringify(forgotPasswordData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
    await page
      .getByTestId("forgot-input-email")
      .fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByTestId("forgot-auth-success")).toBeVisible();
  });

  test("enter key submits", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/forgot-password", (route) => {
      calls++;
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    await page
      .getByTestId("forgot-input-email")
      .fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-input-email").press("Enter");
    await expect(page.getByTestId("forgot-auth-success")).toBeVisible();
    expect(calls).toBeGreaterThanOrEqual(1);
  });
});
