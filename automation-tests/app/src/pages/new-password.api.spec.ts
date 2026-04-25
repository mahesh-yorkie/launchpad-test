import { test, expect } from "@playwright/test";
import { newPasswordData } from "../../../fixtures/mock-data/new-password.data";

const apiBase = "http://localhost:5000/api/v1/reset";

test.describe("New password — API (mocked)", () => {
  test("put strong password: fulfilled 200", async ({ page }) => {
    await page.route("**/api/v1/reset", async (route) => {
      if (route.request().method() !== "PUT")
        return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto("/new-password");
    const status = await page.evaluate(
      ([url, p]) => {
        return fetch(url, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password: p }),
        }).then((r) => r.status);
      },
      [apiBase, newPasswordData.valid.meetAllRules] as [string, string],
    );
    expect(status).toBe(200);
  });

  test("put returns 4xx and body text", async ({ page }) => {
    await page.route("**/api/v1/reset", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: newPasswordData.api.errorMessage }),
      }),
    );
    const status = await page.evaluate(async (url) => {
      const r = await fetch(url, { method: "PUT" });
      return r.status;
    }, apiBase);
    expect(status).toBe(400);
  });

  test("malformed json response is handled in fetch", async ({ page }) => {
    await page.route("**/api/v1/reset", (route) =>
      route.fulfill({ status: 200, body: "{" }),
    );
    const ok = await page.evaluate(async (url) => {
      try {
        const r = await fetch(url, { method: "PUT" });
        await r.json();
        return false;
      } catch {
        return true;
      }
    }, apiBase);
    expect(ok).toBe(true);
  });

  test("aborted request", async ({ page }) => {
    await page.route("**/api/v1/reset", (route) => route.abort("failed"));
    const err = await page
      .evaluate(async (url) => {
        try {
          await fetch(url, { method: "PUT" });
          return "no-err";
        } catch (e) {
          return (e as Error).name;
        }
      }, apiBase)
      .catch(() => "failed");
    expect(err).not.toBe("no-err");
  });
});
