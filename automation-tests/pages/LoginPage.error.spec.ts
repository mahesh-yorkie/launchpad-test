import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

test.describe("Login — Error", () => {
  test("server message appears when present", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({ message: "Weak password" }),
      }),
    );
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("input-confirm").fill(v.confirmPassword);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
    await expect(page.getByText("Weak password")).toBeVisible();
  });

  test("correcting a weak password attempt clears when valid response returns", async ({
    page,
  }) => {
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
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("input-confirm").fill(v.confirmPassword);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toBeVisible();
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-error")).toHaveCount(0);
  });
});
