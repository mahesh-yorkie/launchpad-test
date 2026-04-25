import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

const MOBILE_VIEWPORTS = [
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Android (360)", width: 360, height: 800 },
  { name: "iPad", width: 768, height: 1024 },
] as const;

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Login — Mobile: ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      await page.route("**/api/auth/login", (route) =>
        route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
      );
    });

    test("frame and main are visible", async ({ page }) => {
      await page.goto(ROUTE);
      await expect(page.getByTestId("login-frame")).toBeVisible();
      await expect(page.getByTestId("auth-main")).toBeVisible();
    });

    test("form fields in viewport", async ({ page }) => {
      await page.goto(ROUTE);
      const email = page.getByTestId("input-email");
      await email.click();
      await expect(email).toBeInViewport();
    });

    test("submit button height", async ({ page }) => {
      await page.goto(ROUTE);
      const btn = page.getByTestId("auth-submit");
      const box = await btn.boundingBox();
      expect(box).not.toBeNull();
      expect((box as { height: number }).height).toBeGreaterThanOrEqual(40);
    });
  });
}

test.describe("Login — Mobile: iPhone 14 (submit happy path)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("valid submit on mobile", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
    );
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-email").fill(v.email);
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-success")).toBeVisible();
  });
});
