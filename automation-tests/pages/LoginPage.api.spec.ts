import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

async function fillValid(page: import("@playwright/test").Page) {
  const v = loginData.valid;
  await page.getByTestId("input-email").fill(v.email);
  await page.getByTestId("input-password").fill(v.password);
}

test.describe("Login — API", () => {
  test("201 returns success state", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 201,
        body: JSON.stringify(loginData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-success")).toBeVisible();
  });

  test("500 shows error", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 500, body: "" }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
  });

  test("401 shows error and no success", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unauthorized" }),
      }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
    await expect(page.getByTestId("auth-success")).toHaveCount(0);
  });

  test("network failure shows error", async ({ page }) => {
    await page.route("**/api/auth/login", (route) => route.abort("failed"));
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
  });

  test("400 with non-JSON still shows user-facing error", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 400, contentType: "text/plain", body: "nope" }),
    );
    await page.goto(ROUTE);
    await fillValid(page);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
  });
});
