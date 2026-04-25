import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../../fixtures/mock-data/new-password.data";

const ROUTE = "/new-password";

const sizes = [
  { name: "375×812", w: 375, h: 812 },
  { name: "390×844", w: 390, h: 844 },
  { name: "360×800", w: 360, h: 800 },
  { name: "768×1024", w: 768, h: 1024 },
] as const;

for (const vp of sizes) {
  test.describe(`New password — mobile (${vp.name})`, () => {
    test.use({ viewport: { width: vp.w, height: vp.h } });

    test("form remains usable and primary actions reachable", async ({ page }) => {
      await page.route("**/api/auth/new-password", (route) =>
        route.fulfill({ status: 201, body: JSON.stringify({ ok: true }) }),
      );
      await page.goto(ROUTE);
      const pass = page.getByTestId("field-password");
      const submit = page.getByTestId("submit-login");
      await pass.scrollIntoViewIfNeeded();
      await expect(pass).toBeInViewport();
      await pass.fill(newPasswordData.valid.password);
      await page.getByTestId("field-confirm-password").fill(newPasswordData.valid.confirm);
      await submit.scrollIntoViewIfNeeded();
      await expect(submit).toBeInViewport();
    });
  });
}
