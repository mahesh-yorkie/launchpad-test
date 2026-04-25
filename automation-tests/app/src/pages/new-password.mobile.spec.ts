import { test, expect } from "@playwright/test";

const viewports = [
  { w: 375, h: 812, name: "375×812" },
  { w: 390, h: 844, name: "390×844" },
  { w: 360, h: 800, name: "360×800" },
  { w: 768, h: 1024, name: "768×1024" },
] as const;

for (const vp of viewports) {
  test.describe(`new-password mobile — ${vp.name}`, () => {
    test.use({ viewport: { width: vp.w, height: vp.h } });

    test("form is usable: content loads", async ({ page }) => {
      await page.goto("/new-password");
      await expect(page.getByTestId("new-password-input")).toBeVisible();
    });
  });
}
