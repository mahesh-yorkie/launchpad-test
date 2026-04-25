import { test, expect } from "@playwright/test";
import { signInData } from "../../../fixtures/mock-data/sign-in.data";

test.describe("Sign-in (Login) — Error & Negative Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
  });

  test("error clears after user edits email", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: signInData.api.errorMessage }),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();
    await expect(page.getByRole("alert")).toBeVisible();

    await page.getByTestId("sign-in-email").fill("x");
    await expect(page.getByRole("alert")).not.toBeAttached();
  });

  test("malformed success body shows error", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "not-json",
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();

    await expect(page.getByRole("alert")).toContainText(/malformed response/i);
  });
});
