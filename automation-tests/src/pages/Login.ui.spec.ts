import { test, expect } from '@playwright/test'
import { loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — ui', () => {
  test('form controls, marketing panel, and primary action render', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByTestId('login-form-subtitle'),
    ).toContainText('previously used')
    await expect(page.getByTestId('input-password')).toBeVisible()
    await expect(page.getByTestId('input-confirm-password')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Login' }),
    ).toBeVisible()
    await expect(page.getByTestId('auth-brand-logo')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: loginData.valid.title }),
    ).toBeVisible()
  })
})
