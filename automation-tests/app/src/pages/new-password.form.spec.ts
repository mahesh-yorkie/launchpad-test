import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../fixtures/mock-data/new-password.data";

test.describe("New password — form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new-password");
    await page.waitForLoadState("domcontentloaded");
  });

  test("submit is prevented and page stays (no real handler)", async ({
    page,
  }) => {
    await page.getByTestId("new-password-input").fill(
      newPasswordData.valid.meetAllRules,
    );
    await page.getByTestId("confirm-password-input").fill(
      newPasswordData.valid.meetAllRules,
    );
    await page.getByTestId("new-password-submit").click();
    await expect(page).toHaveURL(/new-password/);
  });

  test("password and confirm are editable with unicode", async ({ page }) => {
    await page
      .getByTestId("new-password-input")
      .fill(newPasswordData.edge.unicode);
    await expect(page.getByTestId("new-password-input")).toHaveValue(
      newPasswordData.edge.unicode,
    );
  });

  test("toggling confirm visibility does not break input", async ({
    page,
  }) => {
    await page.getByTestId("confirm-password-input").fill("X");
    await page.getByTestId("toggle-confirm-visibility").click();
    await expect(page.getByTestId("confirm-password-input")).toBeVisible();
    await page.getByTestId("toggle-confirm-visibility").click();
  });

  test("Enter on submit does not throw", async ({ page }) => {
    await page.getByTestId("new-password-input").press("Tab");
    await page.getByTestId("new-password-submit").press("Enter");
  });
});
