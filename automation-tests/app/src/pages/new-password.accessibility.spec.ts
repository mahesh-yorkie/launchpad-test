import { test, expect } from "@playwright/test";

test.describe("New password — a11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new-password");
  });

  test("one primary form heading is in document", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Set your new password" }),
    ).toBeVisible();
  });

  test("password fields have associated labels", async ({ page }) => {
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(
      page.getByLabel("Confirm New Password", { exact: true }),
    ).toBeVisible();
  });

  test("can tab to main controls in order", async ({ page }) => {
    const chain = page.keyboard;
    await page.getByTestId("new-password-input").focus();
    await chain.press("Tab");
    await expect(page.getByTestId("confirm-password-input")).toBeFocused();
  });

  test("toggle has accessible name", async ({ page }) => {
    await expect(
      page.getByTestId("toggle-confirm-visibility"),
    ).toHaveAttribute("aria-label", /Show password|Hide password/);
  });
});
