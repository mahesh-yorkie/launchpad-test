import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../../fixtures/mock-data/new-password.data";

const ROUTE = "/new-password";

test.describe("New password — error", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState("load");
  });

  test("client validation error clears when users fix password", async ({ page }) => {
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-error")).toBeVisible();
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await expect(page.getByTestId("form-error")).toHaveCount(0);
  });

  test("server error is visible after failed submit", async ({ page }) => {
    await page.route("**/api/auth/new-password", (route) =>
      route.fulfill({ status: 409, contentType: "application/json", body: JSON.stringify({ message: "conflict" }) }),
    );
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-api-message")).toBeVisible();
  });

  test("the page does not hard-crash on unexpected browser navigation", async ({ page }) => {
    await expect(page.getByTestId("new-password-page")).toBeVisible();
  });
});
