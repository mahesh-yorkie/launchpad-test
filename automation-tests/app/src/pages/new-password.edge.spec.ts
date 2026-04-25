import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../fixtures/mock-data/new-password.data";

test.describe("New password — edge", () => {
  test("long password input is accepted in field", async ({ page }) => {
    await page.goto("/new-password");
    const long = newPasswordData.edge.longPassword;
    await page.getByTestId("new-password-input").fill(long);
    const v = await page.getByTestId("new-password-input").inputValue();
    expect(v.length).toBe(long.length);
  });

  test("XSS-like string in password field does not execute", async ({
    page,
  }) => {
    await page.goto("/new-password");
    const x = "<script>".repeat(2);
    await page.getByTestId("new-password-input").fill(x);
    const alerts: string[] = [];
    page.on("dialog", (d) => {
      alerts.push(d.message());
      void d.dismiss();
    });
    await page.getByTestId("new-password-submit").click();
    expect(alerts).toHaveLength(0);
  });

  test("double submit click stays on same route", async ({ page }) => {
    await page.goto("/new-password");
    const btn = page.getByTestId("new-password-submit");
    await btn.click();
    await btn.click();
    await expect(page).toHaveURL(/new-password/);
  });
});
