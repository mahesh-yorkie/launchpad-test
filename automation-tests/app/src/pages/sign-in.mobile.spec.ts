import { test, expect } from "@playwright/test";

const viewports = [
  { width: 375, height: 812, name: "375x812" },
  { width: 390, height: 844, name: "390x844" },
  { width: 360, height: 800, name: "360x800" },
  { width: 768, height: 1024, name: "768x1024" },
] as const;

for (const viewport of viewports) {
  test.describe(`Sign-in (Login) — Mobile ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("form remains usable", async ({ page }) => {
      await page.goto("/sign-in");
      await expect(page.getByRole("heading", { name: /^login$/i })).toBeVisible();
      await expect(page.getByTestId("sign-in-email")).toBeVisible();
      await expect(page.getByTestId("sign-in-password")).toBeVisible();
      await expect(page.getByTestId("sign-in-submit")).toBeVisible();
    });
  });
}
