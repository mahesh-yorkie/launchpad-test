import { test, expect } from "@playwright/test";
import { signInData } from "../../../fixtures/mock-data/sign-in.data";

test.describe("Sign-in (Login) — Form Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submit disabled for invalid email", async ({ page }) => {
    const submit = page.getByTestId("sign-in-submit");
    await page.getByTestId("sign-in-email").fill(signInData.invalid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await expect(submit).toBeDisabled();
  });

  test("submit disabled when password empty", async ({ page }) => {
    const submit = page.getByTestId("sign-in-submit");
    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await expect(submit).toBeDisabled();
  });

  test("valid credentials enable submit", async ({ page }) => {
    const submit = page.getByTestId("sign-in-submit");
    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await expect(submit).toBeEnabled();
  });

  test("successful submit shows confirmation state", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(signInData.api.successBody),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();
    await expect(page.getByRole("status")).toContainText(/signed in successfully/i);
  });

  test("plus-address email with password submits", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(signInData.api.successBody),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.edge.plusEmail);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("long password can be submitted", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(signInData.api.successBody),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.edge.longPassword);
    await page.getByTestId("sign-in-submit").click();
    await expect(page.getByRole("status")).toBeVisible();
  });
});
