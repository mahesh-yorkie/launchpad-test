import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../../fixtures/mock-data/new-password.data";

const ROUTE = "/new-password";

test.describe("New password — edge", () => {
  test("card stays within expected bounds on large viewports", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    const box = await page.getByTestId("new-password-card").boundingBox();
    expect(box?.width).toBeLessThanOrEqual(480);
  });

  test("xss-like password text does not break rendering", async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId("field-password").fill(newPasswordData.edge.xssLike);
    await expect(page.getByTestId("new-password-page")).toBeVisible();
  });

  test("return link navigates to login then back to form", async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId("back-to-login").click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/new-password$/);
  });

  test("double submit is deduplicated to a single network call", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/new-password", (route) => {
      calls++;
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    const btn = page.getByTestId("submit-login");
    await Promise.all([btn.click(), btn.click(), btn.click()]);
    await expect.poll(() => calls, { timeout: 2000 }).toBe(1);
  });
});
