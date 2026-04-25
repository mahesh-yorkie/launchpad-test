import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../fixtures/mock-data/new-password.data";

test.describe("New password — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new-password");
    await page.waitForLoadState("networkidle");
  });

  test("headings and card visible", async ({ page }) => {
    await expect(page.getByTestId("new-password-title")).toBeVisible();
    await expect(page.getByTestId("new-password-card")).toBeVisible();
  });

  test("Login CTA and fields visible and enabled", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Login" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Login" }),
    ).toBeEnabled();
    await expect(page.getByTestId("new-password-input")).toBeVisible();
    await expect(page.getByTestId("confirm-password-input")).toBeVisible();
  });

  test("return link and create-account copy present", async ({ page }) => {
    await expect(page.getByTestId("return-to-login")).toBeVisible();
    await expect(
      page.getByTestId("create-account-prompt"),
    ).toBeVisible();
  });

  test("requirement list reflects current password (initial)", async ({
    page,
  }) => {
    await expect(page.getByTestId("password-rules")).toBeVisible();
    await expect(page.getByTestId("rule-minLen")).toHaveAttribute(
      "data-state",
      "pass",
    );
  });

  test("hero banner shows marketing copy", async ({ page }) => {
    await expect(
      page.getByTestId("auth-hero").getByText("Track, Schedule", {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("filling a strong password updates rule rows", async ({ page }) => {
    const strong = newPasswordData.valid.meetAllRules;
    await page.getByTestId("new-password-input").fill(strong);
    for (const key of [
      "minLen",
      "upper",
      "number",
      "special",
    ] as const) {
      await expect(page.getByTestId(`rule-${key}`)).toHaveAttribute(
        "data-state",
        "pass",
      );
    }
  });
});
