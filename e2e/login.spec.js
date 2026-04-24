import { expect, test } from '@playwright/test'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders marketing column and form', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Track, Schedule, and Optimize Your Pool Services',
      }),
    ).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(
      page.getByText('Login to access your account', { exact: true }),
    ).toBeVisible()

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Login', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Forgot password?' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Forgot password?' }),
    ).toHaveAttribute('href', '#/forgot-password')
  })

  test('toggles password visibility', async ({ page }) => {
    const password = page.getByLabel('Password', { exact: true })
    await expect(password).toHaveAttribute('type', 'password')

    await page.getByRole('button', { name: 'Show password' }).click()
    await expect(password).toHaveAttribute('type', 'text')

    await page.getByRole('button', { name: 'Hide password' }).click()
    await expect(password).toHaveAttribute('type', 'password')
  })

  test('supports keyboard focus order for primary fields', async ({ page }) => {
    await page.getByLabel('Email').focus()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Password', { exact: true })).toBeFocused()
  })
})
