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

  test("submit button and fields render", async ({ page }) => {
    await expect(page.getByTestId("auth-submit")).toBeVisible();
    await expect(page.getByTestId("input-password")).toBeVisible();
    await expect(page.getByTestId("input-confirm")).toBeVisible();
  });

  test("return link is visible", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /return to the login screen/i }),
    ).toBeVisible();
  });

  test("password rules list is visible", async ({ page }) => {
    await expect(page.getByTestId("password-rules")).toBeVisible();
  });
});
