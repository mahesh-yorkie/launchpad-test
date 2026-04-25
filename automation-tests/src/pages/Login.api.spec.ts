import { test, expect } from '@playwright/test'
import { loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — api (mocked)', () => {
  test('mocks a background health check without breaking the static UI', async ({
    page,
  }) => {
    let saw = 0
    await page.route('**/api/health', (route) => {
      saw += 1
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(loginData.api.listSuccess),
      })
    })

    await page.goto('/')
    await expect(page.getByTestId('page-login')).toBeVisible()
    await expect(page.getByTestId('login-form-title')).toBeVisible()
    await expect.poll(() => saw).toBeGreaterThan(0)
  })

  test('mock 500 for health should still leave UI interactive', async ({
    page,
  }) => {
    await page.route('**/api/health', (route) => {
      return route.fulfill({ status: 500, body: 'no' })
    })
    await page.goto('/')
    await expect(page.getByTestId('input-password')).toBeEditable()
  })
})
