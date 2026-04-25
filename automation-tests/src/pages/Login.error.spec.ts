import { test, expect } from '@playwright/test'
import { loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — error', () => {
  test('form remains operable if health call fails in the background', async ({
    page,
  }) => {
    await page.route('**/api/health', (r) => r.abort())
    await page.goto('/')
    await expect(page.getByTestId('primary-submit')).toBeEnabled()
  })

  test('submit does not throw when request payload is not wired', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => {
      errors.push(e.message)
    })
    await page.goto('/')
    await page
      .getByTestId('input-password')
      .fill(loginData.valid.passwordPartial)
    await page
      .getByTestId('input-confirm-password')
      .fill(loginData.valid.passwordPartial)
    await page.getByRole('button', { name: 'Login' }).click()
    expect(errors).toEqual([])
  })
})
