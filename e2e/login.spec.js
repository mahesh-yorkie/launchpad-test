// @ts-check
import { expect, test } from '@playwright/test'

test.describe('Login screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders login form and actions', async ({ page }) => {
    await expect(page.getByTestId('login-page')).toBeVisible()
    await expect(page.getByTestId('login-title')).toHaveText('Login')
    await expect(page.getByTestId('login-subtitle')).toHaveText(
      'Login to access your account',
    )
    await expect(page.getByTestId('input-email')).toBeVisible()
    await expect(page.getByTestId('input-password')).toBeVisible()
    await expect(page.getByTestId('toggle-password-visibility')).toBeVisible()
    await expect(page.getByTestId('submit-login')).toContainText('Login')
    await expect(page.getByTestId('link-forgot-password')).toHaveText(
      'Forgot password?',
    )
  })

  test('prefills design email and supports password visibility', async ({ page }) => {
    await expect(page.getByTestId('input-email')).toHaveValue('alexmora@gmail.com')
    await page.getByTestId('input-password').fill('secret')
    const toggle = page.getByRole('button', { name: 'Show password' })
    await expect(page.getByTestId('input-password')).toHaveAttribute(
      'type',
      'password',
    )
    await toggle.click()
    await expect(page.getByTestId('input-password')).toHaveAttribute('type', 'text')
  })

  test('can navigate to new password flow via hash', async ({ page }) => {
    await page.goto('/#new-password')
    await expect(page.getByTestId('new-password-page')).toBeVisible()
  })
})
