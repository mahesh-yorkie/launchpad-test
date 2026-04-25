import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../../fixtures/mock-data/new-password.data";

const ROUTE = "/new-password";

test.describe("New password — form", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/new-password", (route) =>
      route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: 1 }) }),
    );
    await page.goto(ROUTE);
    await page.waitForLoadState("load");
  });

  test("submit with empty values shows requirements message", async ({ page }) => {
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-error")).toContainText(/password requirements/i);
  });

  test("mismatched passwords show error and clear when fixed", async ({ page }) => {
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill("Different1!");
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-error")).toContainText(/do not match/i);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await expect(page.getByTestId("form-error")).toHaveCount(0);
  });

  test("valid submission reaches API and leaves form", async ({ page }) => {
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("password requirements react to input", async ({ page }) => {
    await expect(page.getByText(/Minimum 8 characters/i).first()).toBeVisible();
    await page.getByTestId("field-password").fill("a");
    await expect(page.getByText(/Minimum 8 characters/i).first()).toBeVisible();
  });

  test("whitespace-only confirm is treated as mismatch or invalid", async ({ page }) => {
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.edge.whitespaceOnly);
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-error")).toBeVisible();
  });

  test("long password input does not break the form", async ({ page }) => {
    const long = "Aa1!".padEnd(400, "x");
    await page.getByTestId("field-password").fill(long);
    await expect(page.getByTestId("field-password")).toBeVisible();
  });
});
