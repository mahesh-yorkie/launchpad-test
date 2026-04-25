import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

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

  test("forgot link is present and focusable", async ({ page }) => {
    await page.goto(ROUTE);
    const link = page.getByTestId("link-forgot-password");
    await expect(link).toBeVisible();
    await link.focus();
  });

  test("password visibility toggle", async ({ page }) => {
    await page.goto(ROUTE);
    const toggle = page.getByTestId("toggle-password-visibility");
    await toggle.click();
    await expect(page.getByTestId("input-password")).toHaveAttribute(
      "type",
      "text",
    );
  });

  test("forgot link navigates to forgot-password", async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId("link-forgot-password").click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});
