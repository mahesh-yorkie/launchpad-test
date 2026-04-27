// @ts-check
import { expect, test } from '@playwright/test'

test.describe('Forgot password screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#forgot-password')
  })

  test('renders copy, email field, confirm, and back link', async ({ page }) => {
    await expect(page.getByTestId('forgot-password-page')).toBeVisible()
    await expect(page.getByTestId('forgot-password-title')).toHaveText(
      'Forgot your password',
    )
    await expect(page.getByTestId('forgot-password-subtitle')).toContainText(
      'initiate the password reset',
    )
    await expect(page.getByTestId('input-forgot-email')).toBeVisible()
    await expect(page.getByTestId('input-forgot-email')).toHaveValue(
      'alexmora@gmail.com',
    )
    await expect(page.getByTestId('submit-forgot-confirm')).toContainText('Confirm')
    await expect(
      page.getByTestId('back-to-login'),
    ).toContainText('Return to the login screen')
  })

  test('return link navigates to login hash', async ({ page }) => {
    await page.getByTestId('back-to-login').click()
    await expect(page).toHaveURL(/#login/)
    await expect(page.getByTestId('login-page')).toBeVisible()
  })
})
