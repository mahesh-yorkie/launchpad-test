import { expect, test } from '@playwright/test'

test.describe('Forgot password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/forgot-password')
  })

  test('renders form and marketing column', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Track, Schedule, and Optimize Your Pool Services',
      }),
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: 'Forgot your password' }),
    ).toBeVisible()
    await expect(
      page.getByText(
        'Please enter your email address below to initiate the password reset process.',
        { exact: true },
      ),
    ).toBeVisible()

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Confirm', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Return to the login screen' }),
    ).toBeVisible()
  })

  test('returns to login from footer link', async ({ page }) => {
    await page.getByRole('link', { name: 'Return to the login screen' }).click()
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })
})

test.describe('Login → Forgot password', () => {
  test('navigates via hash route', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Forgot password?' }).click()
    await expect(
      page.getByRole('heading', { name: 'Forgot your password' }),
    ).toBeVisible()
  })
})
