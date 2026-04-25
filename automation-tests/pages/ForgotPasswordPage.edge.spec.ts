import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../fixtures/mock-data/forgot-password.data";

const ROUTE = "/forgot-password";

test.describe("Forgot password — Edge", () => {
  test("return link navigates to login", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({ status: 200, body: "{}" }),
    );
    await page.goto(ROUTE);
    await page.getByTestId("forgot-return-login").click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
