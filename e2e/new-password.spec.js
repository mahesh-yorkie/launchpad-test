// @ts-check
import { expect, test } from '@playwright/test'

test.describe('New password screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#new-password')
  })

  test('renders all primary sections and copy', async ({ page }) => {
    await expect(page.getByTestId('new-password-page')).toBeVisible()
    await expect(page.getByTestId('new-password-title')).toHaveText(
      'Set your new password',
    )
    await expect(page.getByTestId('new-password-subtitle')).toContainText(
      'previously used passwords',
    )
    await expect(page.getByTestId('input-new-password')).toBeVisible()
    await expect(page.getByTestId('input-confirm')).toBeVisible()
    await expect(page.getByTestId('toggle-confirm-visibility')).toBeVisible()
    await expect(page.getByTestId('submit-new-password')).toContainText('Login')
    await expect(
      page.getByTestId('back-to-login'),
    ).toContainText('Return to the login screen')
  })

  test('requirement list reflects password strength in real time', async ({
    page,
  }) => {
    const pwd = page.getByTestId('input-new-password')
    await expect(page.getByTestId('req-min8')).toHaveAttribute('data-state', 'fail')
    await pwd.fill('Abcde1!x')
    await expect(page.getByTestId('req-min8')).toHaveAttribute('data-state', 'pass')
    await expect(page.getByTestId('req-upper')).toHaveAttribute('data-state', 'pass')
    await expect(page.getByTestId('req-number')).toHaveAttribute('data-state', 'pass')
    await expect(page.getByTestId('req-special')).toHaveAttribute('data-state', 'pass')
  })

  test('toggles confirm field visibility with eye control', async ({ page }) => {
    await page.getByTestId('input-confirm').fill('secret')
    const toggle = page.getByRole('button', { name: 'Show password' })
    await expect(page.getByTestId('input-confirm')).toHaveAttribute(
      'type',
      'password',
    )
    await toggle.click()
    await expect(page.getByTestId('input-confirm')).toHaveAttribute('type', 'text')
  })
})
