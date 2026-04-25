import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../fixtures/mock-data/new-password.data";

test.describe("New password — error states", () => {
  test("rule rows show fail for too-short password", async ({ page }) => {
    await page.goto("/new-password");
    await page
      .getByTestId("new-password-input")
      .fill(newPasswordData.invalid.tooShort);
    await expect(page.getByTestId("rule-minLen")).toHaveAttribute(
      "data-state",
      "fail",
    );
  });

  test("number rule fails when digits removed", async ({ page }) => {
    await page.goto("/new-password");
    await page.getByTestId("new-password-input").fill("Abcdefgh");
    await expect(page.getByTestId("rule-number")).toHaveAttribute(
      "data-state",
      "fail",
    );
  });
});
