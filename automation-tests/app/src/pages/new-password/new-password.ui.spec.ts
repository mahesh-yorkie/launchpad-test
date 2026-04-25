import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../../fixtures/mock-data/new-password.data";

const ROUTE = "/new-password";

test.describe("New password — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/new-password", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(newPasswordData.api.successMessage),
      }),
    );
    await page.goto(ROUTE);
    await page.waitForLoadState("load");
  });

  test("heading and subcopy are visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /set your new password/i })).toBeVisible();
    await expect(page.getByText(/differs from previously used passwords/i)).toBeVisible();
  });

  test("password fields and login button are visible", async ({ page }) => {
    await expect(page.getByTestId("field-password")).toBeVisible();
    await expect(page.getByTestId("field-confirm-password")).toBeVisible();
    await expect(page.getByTestId("submit-login")).toBeVisible();
  });

  test("branded left rail and privacy link are visible on desktop", async ({ page }) => {
    await expect(page.getByTestId("branded-auth-shell")).toBeVisible();
    await expect(page.getByText(/Track, Schedule, and Optimize Your Pool Services/i)).toBeVisible();
    await expect(page.getByTestId("auth-privacy-link")).toBeVisible();
  });

  test("return link points to login route", async ({ page }) => {
    const link = page.getByTestId("back-to-login");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/login");
  });
});
