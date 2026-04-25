import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

test.describe("Login — Form", () => {
  test("submit disabled when email invalid", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/login", (route) => {
      calls++;
      return route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    await page.getByTestId("input-email").fill(loginData.invalid.email);
    await page.getByTestId("input-password").fill(loginData.valid.password);
    await expect(page.getByTestId("auth-submit")).toBeDisabled();
    await expect.poll(() => calls, { timeout: 500 }).toBe(0);
  });

  test("valid submission succeeds", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(loginData.api.successBody),
      }),
    );
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-email").fill(v.email);
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-success")).toBeVisible();
  });

  test("enter submits when valid", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/login", (route) => {
      calls++;
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-email").fill(v.email);
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("input-password").press("Enter");
    await expect(page.getByTestId("auth-success")).toBeVisible();
    expect(calls).toBeGreaterThanOrEqual(1);
  });

  test("double click does not duplicate request", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/login", (route) => {
      calls++;
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-email").fill(v.email);
    await page.getByTestId("input-password").fill(v.password);
    const btn = page.getByTestId("auth-submit");
    await expect(btn).toBeEnabled();
    await btn.click({ clickCount: 2 });
    await expect(page.getByTestId("auth-success")).toBeVisible();
    await expect.poll(() => calls, { timeout: 2000 }).toBe(1);
  });

  test("empty password keeps submit disabled after clearing", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await page.getByTestId("input-password").fill("");
    await expect(page.getByTestId("auth-submit")).toBeDisabled();
  });
});
