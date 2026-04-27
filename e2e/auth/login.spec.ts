import { expect, test } from '@playwright/test'

import { AUTH_BRANDING_COPY } from '../../src/const/auth-branding'
import { LOGIN_COPY } from '../../src/const/login'
import { ROUTES } from '../../src/const/routes'
import { PROTOTYPE_VALID_LOGIN } from '../../src/mocks/data/auth-login'

test.describe('Login — sign-in flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.login)
  })

  test.describe('Happy Flow', () => {
    test('loads the split layout with marketing and the login card', async ({
      page,
    }) => {
      await expect(
        page.getByRole('heading', { name: LOGIN_COPY.title }),
      ).toBeVisible()
      await expect(
        page.getByText(AUTH_BRANDING_COPY.marketingHeading),
      ).toBeVisible()
    })

    test('submits valid credentials and lands on the dashboard route', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: LOGIN_COPY.emailLabel, exact: true })
        .fill(PROTOTYPE_VALID_LOGIN.email)
      await page.getByLabel(LOGIN_COPY.passwordLabel, { exact: true }).fill(PROTOTYPE_VALID_LOGIN.password)
      await page.getByRole('button', { name: LOGIN_COPY.submit }).click()

      await expect(page).toHaveURL(new RegExp(`${ROUTES.dashboard}$`))
      await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible()
    })

    test('navigates to forgot password from the inline link', async ({ page }) => {
      await page.getByRole('link', { name: LOGIN_COPY.forgotPassword }).click()
      await expect(page).toHaveURL(new RegExp(`${ROUTES.forgotPassword}$`))
    })
  })

  test.describe('Error & Negative Cases', () => {
    test('shows both required errors when submitting an empty form', async ({
      page,
    }) => {
      await page.getByRole('button', { name: LOGIN_COPY.submit }).click()

      await expect(
        page.getByText('Email is required', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByText('Password is required', { exact: true }),
      ).toBeVisible()
    })

    test('shows invalid credentials for a wrong password', async ({ page }) => {
      await page
        .getByRole('textbox', { name: LOGIN_COPY.emailLabel, exact: true })
        .fill(PROTOTYPE_VALID_LOGIN.email)
      await page.getByLabel(LOGIN_COPY.passwordLabel, { exact: true }).fill('WrongPass1!')
      await page.getByRole('button', { name: LOGIN_COPY.submit }).click()

      await expect(
        page.getByText('Invalid credentials', { exact: true }),
      ).toBeVisible()
    })

    test('shows the server error when the mock forces HTTP 500', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.login}?mock-error=login-500`)

      await page
        .getByRole('textbox', { name: LOGIN_COPY.emailLabel, exact: true })
        .fill(PROTOTYPE_VALID_LOGIN.email)
      await page.getByLabel(LOGIN_COPY.passwordLabel, { exact: true }).fill(PROTOTYPE_VALID_LOGIN.password)
      await page.getByRole('button', { name: LOGIN_COPY.submit }).click()

      await expect(
        page.getByText('Unexpected server error', { exact: true }),
      ).toBeVisible()
    })

    test('shows the account-not-found message when the mock forces HTTP 404', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.login}?mock-error=login-404`)

      await page
        .getByRole('textbox', { name: LOGIN_COPY.emailLabel, exact: true })
        .fill(PROTOTYPE_VALID_LOGIN.email)
      await page.getByLabel(LOGIN_COPY.passwordLabel, { exact: true }).fill(PROTOTYPE_VALID_LOGIN.password)
      await page.getByRole('button', { name: LOGIN_COPY.submit }).click()

      await expect(page.getByText('Account not found', { exact: true })).toBeVisible()
    })

    test('shows the locked-account message when the mock forces HTTP 409', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.login}?mock-error=login-409`)

      await page
        .getByRole('textbox', { name: LOGIN_COPY.emailLabel, exact: true })
        .fill(PROTOTYPE_VALID_LOGIN.email)
      await page.getByLabel(LOGIN_COPY.passwordLabel, { exact: true }).fill(PROTOTYPE_VALID_LOGIN.password)
      await page.getByRole('button', { name: LOGIN_COPY.submit }).click()

      await expect(page.getByText('Account locked', { exact: true })).toBeVisible()
    })
  })

  test.describe('Edge Cases', () => {
    test('submits when pressing Enter from the password field', async ({ page }) => {
      await page
        .getByRole('textbox', { name: LOGIN_COPY.emailLabel, exact: true })
        .fill(PROTOTYPE_VALID_LOGIN.email)
      const passwordField = page.getByLabel(LOGIN_COPY.passwordLabel, {
        exact: true,
      })
      await passwordField.fill(PROTOTYPE_VALID_LOGIN.password)
      await passwordField.press('Enter')

      await expect(page).toHaveURL(new RegExp(`${ROUTES.dashboard}$`))
    })

    test('toggles password visibility without losing the typed value', async ({
      page,
    }) => {
      const field = page.getByLabel(LOGIN_COPY.passwordLabel, { exact: true })
      await field.fill(PROTOTYPE_VALID_LOGIN.password)
      await page.getByRole('button', { name: 'Show password value' }).click()
      await expect(field).toHaveAttribute('type', 'text')
      await page.getByRole('button', { name: 'Hide password value' }).click()
      await expect(field).toHaveAttribute('type', 'password')
      await expect(field).toHaveValue(PROTOTYPE_VALID_LOGIN.password)
    })
  })

  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('loads without horizontal overflow and keeps the login button tappable', async ({
      page,
    }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      )
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      )
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)

      const submit = page.getByRole('button', { name: LOGIN_COPY.submit })
      const box = await submit.boundingBox()
      expect(box).not.toBeNull()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    })

    test('keeps the email label above the field on narrow screens', async ({
      page,
    }) => {
      const field = page.getByRole('textbox', {
        name: LOGIN_COPY.emailLabel,
        exact: true,
      })
      const label = page.getByText(LOGIN_COPY.emailLabel, { exact: true })

      const labelBox = await label.boundingBox()
      const fieldBox = await field.boundingBox()
      expect(labelBox && fieldBox).toBeTruthy()
      if (labelBox && fieldBox) {
        expect(labelBox.y).toBeLessThan(fieldBox.y)
      }
    })
  })
})
