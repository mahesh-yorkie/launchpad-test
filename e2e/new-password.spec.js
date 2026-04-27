import { test, expect } from '@playwright/test'

test.describe('New password screen (1440 mock)', () => {
  test('renders marketing column and set-password form with requirements', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: 'Track, Schedule, and Optimize Your Pool Services',
      }),
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: 'Set your new password' }),
    ).toBeVisible()
    await expect(
      page.getByText('Ensure that your new password differs from previously used passwords.', {
        exact: true,
      }),
    ).toBeVisible()

    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirm New Password', { exact: true })).toBeVisible()

    await expect(page.getByText('Minimum 8 characters', { exact: true })).toBeVisible()
    await expect(page.getByText('At least 1 number', { exact: true })).toBeVisible()

    const loginBtn = page.getByRole('button', { name: 'Login' })
    await expect(loginBtn).toBeVisible()

    await expect(
      page.getByRole('link', { name: 'Return to the login screen' }),
    ).toHaveAttribute('href', '/login')
  })

  test('toggles confirm password visibility', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /hide password|show password/i })
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })
})
