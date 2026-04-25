import { test, expect } from "@playwright/test";
import { signInData } from "../../../fixtures/mock-data/sign-in.data";

test.describe("Sign-in (Login) — Edge Cases", () => {
  test("forgot password link navigates away", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByTestId("sign-in-forgot-password").click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test("browser back returns to sign-in", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByTestId("sign-in-forgot-password").click();
    await expect(page).toHaveURL(/\/forgot-password$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test("double submit does not send duplicate requests", async ({ page }) => {
    let callCount = 0;
    await page.route("**/api/auth/login", async (route) => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(signInData.api.successBody),
      });
    });

    await page.goto("/sign-in");
    await page.getByTestId("sign-in-email").fill(signInData.valid.email);
    await page.getByTestId("sign-in-password").fill(signInData.valid.password);
    await page.getByTestId("sign-in-submit").dblclick();

    await expect.poll(() => callCount, { timeout: 5_000 }).toBe(1);
  });

  test("auth shell fits large desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/sign-in");
    const shell = page.getByTestId("auth-shell");
    const box = await shell.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(1200);
  });
});
