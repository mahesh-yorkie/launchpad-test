import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

test.describe("Login — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
  });

  test("sidebar headline is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /Track, Schedule, and Optimize Your Pool Services/i,
        level: 2,
      }),
    ).toBeVisible();
  });

  test("submit, email, password, and forgot link render", async ({ page }) => {
    await expect(page.getByTestId("auth-submit")).toBeVisible();
    await expect(page.getByTestId("input-email")).toBeVisible();
    await expect(page.getByTestId("input-password")).toBeVisible();
    await expect(page.getByTestId("link-forgot-password")).toBeVisible();
  });

  test("subtitle is visible", async ({ page }) => {
    await expect(
      page.getByText(/login to access your account/i),
    ).toBeVisible();
  });
});
