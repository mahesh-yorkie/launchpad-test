import { test, expect } from "@playwright/test";
import { signInData } from "../../../fixtures/mock-data/sign-in.data";

test.describe("Sign-in (Login) — API Mock Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submits correct payload on success", async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;
    await page.route("**/api/auth/login", async (route) => {
      capturedBody = JSON.parse(route.request().postData() || "{}") as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(signInData.api.successBody),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();

    await expect.poll(() => capturedBody).toEqual({
      email: signInData.valid.email,
      password: signInData.valid.password,
    });
  });

  test("shows alert on 401 response", async ({ page }) => {
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

    await expect(page.getByRole("alert")).toContainText(signInData.api.errorMessage);
  });

  test("shows alert on 500 response", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Server error" }),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("shows alert when network fails", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => route.abort("failed"));

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("handles slow API response without duplicate submissions", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/auth/login", async (route) => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(signInData.api.successBody),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();
    await expect(page.getByRole("status")).toBeVisible();
    expect(callCount).toBe(1);
  });

  test("429 rate limit surfaces server message", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ message: signInData.api.rateLimitMessage }),
      });
    });

    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").click();

    await expect(page.getByRole("alert")).toContainText(signInData.api.rateLimitMessage);
  });
});
