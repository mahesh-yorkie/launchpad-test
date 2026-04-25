import { test, expect } from "@playwright/test";
const ROUTE = "/login";

test.describe("Login — Edge", () => {
  test("main content fits at fixed width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
    );
    await page.goto(ROUTE);
    const main = page.getByTestId("auth-main");
    const box = await main.boundingBox();
    expect(box).not.toBeNull();
    expect((box as { width: number }).width).toBeLessThanOrEqual(1440);
  });

  test("special character password still validates", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
    );
    await page.goto(ROUTE);
    const pwd = "Aa1!@#$%";
    await page.getByTestId("input-password").fill(pwd);
    await page.getByTestId("input-confirm").fill(pwd);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-success")).toBeVisible();
  });

  test("filling and clearing confirm toggles without crash", async ({
    page,
  }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
    );
    await page.goto(ROUTE);
    await page.getByTestId("input-confirm").fill("x");
    await page.getByTestId("input-confirm").fill("");
    await expect(page.getByTestId("login-frame")).toBeVisible();
  });
});
