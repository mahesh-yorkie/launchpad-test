import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../fixtures/mock-data/forgot-password.data";

const ROUTE = "/forgot-password";

async function fillValid(page: import("@playwright/test").Page) {
  await page
    .getByTestId("forgot-input-email")
    .fill(forgotPasswordData.valid.email);
}

test.describe("Forgot password — API", () => {
  test("201 shows success", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({
        status: 201,
        body: JSON.stringify(forgotPasswordData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByTestId("forgot-auth-success")).toBeVisible();
  });

  test("500 shows error", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({ status: 500, body: "" }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByTestId("forgot-auth-error")).toBeVisible();
  });

  test("network failure shows error", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) => route.abort("failed"));
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByTestId("forgot-auth-error")).toBeVisible();
  });

  test("400 with plain body shows error", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({ status: 400, contentType: "text/plain", body: "bad" }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByTestId("forgot-auth-error")).toBeVisible();
  });
});
