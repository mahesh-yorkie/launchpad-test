import { test, expect } from "@playwright/test";
import { forgotPasswordData } from "../fixtures/mock-data/forgot-password.data";

const ROUTE = "/forgot-password";

const MOBILE = [
  { w: 390, h: 844 },
  { w: 375, h: 812 },
  { w: 360, h: 800 },
  { w: 768, h: 1024 },
] as const;

for (const v of MOBILE) {
  test.describe(`Forgot password — Mobile ${v.w}×${v.h}`, () => {
    test.use({ viewport: { width: v.w, height: v.h } });
    test("frame visible", async ({ page }) => {
      await page.route("**/api/auth/forgot-password", (r) => r.fulfill({ status: 200, body: "{}" }));
      await page.goto(ROUTE);
      await expect(page.getByTestId("forgot-password-frame")).toBeVisible();
    });
  });
}
