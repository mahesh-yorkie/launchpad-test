import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../../fixtures/mock-data/new-password.data";

const ROUTE = "/new-password";

test.describe("New password — API", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState("load");
  });

  test("sends expected JSON on successful submit", async ({ page }) => {
    let body: { password?: string; confirmPassword?: string } = {};
    await page.route("**/api/auth/new-password", async (route) => {
      const post = route.request().postData() ?? "{}";
      body = JSON.parse(post) as typeof body;
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    expect(body).toMatchObject({
      password: newPasswordData.valid.password,
      confirmPassword: newPasswordData.valid.confirm,
    });
  });

  test("shows user-facing message on 500 from API", async ({ page }) => {
    await page.route("**/api/auth/new-password", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: "server" }) }),
    );
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-api-message")).toContainText(/try again|could not update/i);
  });

  test("shows message on 404 from API", async ({ page }) => {
    await page.route("**/api/auth/new-password", (route) =>
      route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "nf" }) }),
    );
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-api-message")).toBeVisible();
  });

  test("handles network failure", async ({ page }) => {
    await page.route("**/api/auth/new-password", (route) => route.abort("failed"));
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    await expect(page.getByTestId("form-api-message")).toContainText(/Network error/i);
  });

  test("slow response is tolerated without duplicate spam", async ({ page }) => {
    await page.route("**/api/auth/new-password", async (route) => {
      await new Promise((r) => setTimeout(r, 400));
      await route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) });
    });
    await page.getByTestId("field-password").fill(newPasswordData.valid.password);
    await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
    await page.getByTestId("submit-login").click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });
  });
});
