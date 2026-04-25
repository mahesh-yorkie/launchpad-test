import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../fixtures/mock-data/forgot-password.data";

const ROUTE = "/forgot-password";

test.describe("Forgot password — Error", () => {
  test("custom server message", async ({ page }) => {
    await page.route("**/api/auth/forgot-password", (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({ message: "User not found" }),
      }),
    );
    await page.goto(ROUTE);
    await page
      .getByTestId("forgot-input-email")
      .fill(forgotPasswordData.valid.email);
    await page.getByTestId("forgot-submit").click();
    await expect(page.getByText("User not found")).toBeVisible();
  });
});
