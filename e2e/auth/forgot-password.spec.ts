import { expect, test } from '@playwright/test'

import { FORGOT_PASSWORD_COPY } from '../../src/const/forgot-password'
import { AUTH_BRANDING_COPY } from '../../src/const/auth-branding'
import { ROUTES } from '../../src/const/routes'
import { VALID_FORGOT_EMAIL } from '../../test/forgot-password/fixtures/email-fixtures'

test.describe('ForgotPassword — reset request flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.forgotPassword)
  })

  test.describe('Happy Flow', () => {
    test('loads the split layout with marketing and the forgot-password card', async ({
      page,
    }) => {
      await expect(
        page.getByRole('heading', { name: FORGOT_PASSWORD_COPY.title }),
      ).toBeVisible()
      await expect(
        page.getByText(AUTH_BRANDING_COPY.marketingHeading),
      ).toBeVisible()
    })

    test('submits a valid email and returns to the login route', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .fill(VALID_FORGOT_EMAIL)
      await page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }).click()

      await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`))
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    })

    test('navigates back to the login screen from the return link', async ({
      page,
    }) => {
      await page.getByRole('link', { name: FORGOT_PASSWORD_COPY.backToLogin }).click()
      await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`))
    })
  })

  test.describe('Error & Negative Cases', () => {
    test('shows the required error when submitting an empty form', async ({
      page,
    }) => {
      await page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('Email is required', { exact: true }),
      ).toBeVisible()
    })

    test('shows the format error when the email is invalid', async ({ page }) => {
      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .fill('not-an-email')
      await page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('Enter a valid email address', { exact: true }),
      ).toBeVisible()
    })

    test('shows the server error when the mock forces HTTP 500', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.forgotPassword}?mock-error=forgot-password-500`)

      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .fill(VALID_FORGOT_EMAIL)
      await page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('Unexpected server error', { exact: true }),
      ).toBeVisible()
    })

    test('shows the not-found message when the mock forces HTTP 404', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.forgotPassword}?mock-error=forgot-password-404`)

      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .fill(VALID_FORGOT_EMAIL)
      await page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('No account found for that email', { exact: true }),
      ).toBeVisible()
    })

    test('shows the unauthorized message when the mock forces HTTP 401', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.forgotPassword}?mock-error=forgot-password-401`)

      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .fill(VALID_FORGOT_EMAIL)
      await page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }).click()

      await expect(page.getByText('Session expired', { exact: true })).toBeVisible()
    })
  })

  test.describe('Edge Cases', () => {
    test('submits when pressing Enter inside the email field', async ({ page }) => {
      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .fill(VALID_FORGOT_EMAIL)
      await page
        .getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel, exact: true })
        .press('Enter')

      await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`))
    })

    test('scrolls the privacy anchor without leaving the auth route', async ({
      page,
    }) => {
      await page.getByRole('link', { name: AUTH_BRANDING_COPY.privacy }).click()
      await expect(page).toHaveURL(new RegExp(`${ROUTES.forgotPassword}#privacy-notice`))
      await expect(page.locator('#privacy-notice')).toBeVisible()
    })
  })

  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('loads without horizontal overflow and keeps the confirm control tappable', async ({
      page,
    }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      )
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      )
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)

      const submit = page.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit })
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
        name: FORGOT_PASSWORD_COPY.emailLabel,
        exact: true,
      })
      const label = page.getByText(FORGOT_PASSWORD_COPY.emailLabel, { exact: true })

      const labelBox = await label.boundingBox()
      const fieldBox = await field.boundingBox()
      expect(labelBox && fieldBox).toBeTruthy()
      if (labelBox && fieldBox) {
        expect(labelBox.y).toBeLessThan(fieldBox.y)
      }
    })
  })
})
