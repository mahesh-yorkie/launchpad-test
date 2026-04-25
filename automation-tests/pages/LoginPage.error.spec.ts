import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

test.describe("Login — Error", () => {
  test("server message appears when present", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid credentials" }),
      }),
    );
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-email").fill(v.email);
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("retry with success clears error", async ({ page }) => {
    let failOnce = true;
    await page.route("**/api/auth/login", (route) => {
      if (failOnce) {
        failOnce = false;
        return route.fulfill({ status: 500, body: "err" });
      }
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-email").fill(v.email);
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toHaveCount(0);
  });
});
