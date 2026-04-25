import { test, expect } from "@playwright/test";
import { loginData } from "../fixtures/mock-data/login.data";

const ROUTE = "/login";

test.describe("Login — Form", () => {
  test("submit disabled when rules not satisfied", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/login", (route) => {
      calls++;
      return route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    await expect(page.getByTestId("auth-submit")).toBeDisabled();
    await page.getByTestId("input-password").fill("short");
    await page.getByTestId("input-confirm").fill("short");
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
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("input-confirm").fill(v.confirmPassword);
    await page.getByTestId("auth-submit").click();
    await expect(page.getByTestId("auth-success")).toBeVisible();
  });

  test("mismatching passwords do not show success", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/login", (route) => {
      calls++;
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    await page
      .getByTestId("input-password")
      .fill(loginData.valid.password);
    await page
      .getByTestId("input-confirm")
      .fill(loginData.invalid.notMatching.confirmPassword);
    await expect(page.getByTestId("auth-submit")).toBeDisabled();
    await expect.poll(() => calls, { timeout: 500 }).toBe(0);
  });

  test("enter submits when valid", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/auth/login", (route) => {
      calls++;
      return route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.goto(ROUTE);
    const v = loginData.valid;
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("input-confirm").fill(v.confirmPassword);
    await page.getByTestId("input-confirm").press("Enter");
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
    await page.getByTestId("input-password").fill(v.password);
    await page.getByTestId("input-confirm").fill(v.confirmPassword);
    const btn = page.getByTestId("auth-submit");
    await expect(btn).toBeEnabled();
    await btn.click({ clickCount: 2 });
    await expect(page.getByTestId("auth-success")).toBeVisible();
    await expect.poll(() => calls, { timeout: 2000 }).toBe(1);
  });

  test("whitespace-only is treated as weak password", async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId("input-password").fill(loginData.edge.whitespaceOnly);
    await page
      .getByTestId("input-confirm")
      .fill(loginData.edge.whitespaceOnly);
    await expect(page.getByTestId("auth-submit")).toBeDisabled();
  });

  test("long text does not crash the inputs", async ({ page }) => {
    await page.goto(ROUTE);
    const long = loginData.edge.longName;
    await page.getByTestId("input-password").fill(long);
    await expect(page.getByTestId("input-password")).toHaveValue(long);
  });
});
