import { expect, test } from '@playwright/test'

import { NEW_PASSWORD_COPY } from '../../src/const/new-password'
import { ROUTES } from '../../src/const/routes'
import {
  VALID_CONFIRM_MATCH,
  VALID_NEW_PASSWORD,
} from '../../test/new-password/fixtures/password-fixtures'

test.describe('NewPassword — set password flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.newPassword)
  })

  test.describe('Happy Flow', () => {
    test('loads the screen with the marketing column and form card', async ({
      page,
    }) => {
      await expect(
        page.getByRole('heading', { name: NEW_PASSWORD_COPY.title }),
      ).toBeVisible()
      await expect(
        page.getByText(NEW_PASSWORD_COPY.marketingHeading),
      ).toBeVisible()
    })

    test('submits valid credentials and lands on the login route', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.passwordLabel, exact: true })
        .fill(VALID_NEW_PASSWORD)
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.confirmLabel, exact: true })
        .fill(VALID_CONFIRM_MATCH)
      await page.getByRole('button', { name: NEW_PASSWORD_COPY.submit }).click()

      await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`))
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    })

    test('navigates back to the login screen from the footer link', async ({
      page,
    }) => {
      await page.getByRole('link', { name: NEW_PASSWORD_COPY.backToLogin }).click()
      await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`))
    })
  })

  test.describe('Error & Negative Cases', () => {
    test('shows both required errors when submitting an empty form', async ({
      page,
    }) => {
      await page.getByRole('button', { name: NEW_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('Password is required', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByText('Confirm New Password is required', { exact: true }),
      ).toBeVisible()
    })

    test('shows mismatch copy when confirmation differs from the password', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.passwordLabel, exact: true })
        .fill(VALID_NEW_PASSWORD)
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.confirmLabel, exact: true })
        .fill(`${VALID_NEW_PASSWORD}typo`)
      await page.getByRole('button', { name: NEW_PASSWORD_COPY.submit }).click()

      await expect(page.getByText('Passwords do not match')).toBeVisible()
    })

    test('shows the server error copy when the mock forces HTTP 500', async ({
      page,
    }) => {
      await page.goto(`${ROUTES.newPassword}?mock-error=set-password-500`)

      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.passwordLabel, exact: true })
        .fill(VALID_NEW_PASSWORD)
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.confirmLabel, exact: true })
        .fill(VALID_CONFIRM_MATCH)
      await page.getByRole('button', { name: NEW_PASSWORD_COPY.submit }).click()

      await expect(page.getByText('Unexpected server error')).toBeVisible()
    })

    test('blocks submit when uppercase letters are missing', async ({ page }) => {
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.passwordLabel, exact: true })
        .fill('andrewsalgado@9!')
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.confirmLabel, exact: true })
        .fill('andrewsalgado@9!')
      await page.getByRole('button', { name: NEW_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('Password must satisfy every requirement below'),
      ).toBeVisible()
    })

    test('shows only the confirmation error when the password is already valid', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.passwordLabel, exact: true })
        .fill(VALID_NEW_PASSWORD)
      await page.getByRole('button', { name: NEW_PASSWORD_COPY.submit }).click()

      await expect(
        page.getByText('Confirm New Password is required', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByText('Password is required', { exact: true }),
      ).toHaveCount(0)
    })
  })

  test.describe('Edge Cases', () => {
    test('submits when pressing Enter inside the confirmation field', async ({
      page,
    }) => {
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.passwordLabel, exact: true })
        .fill(VALID_NEW_PASSWORD)
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.confirmLabel, exact: true })
        .fill(`${VALID_CONFIRM_MATCH}`)
      await page
        .getByRole('textbox', { name: NEW_PASSWORD_COPY.confirmLabel, exact: true })
        .press('Enter')

      await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`))
    })

    test('toggles the confirmation visibility control without losing input text', async ({
      page,
    }) => {
      const confirm = page.getByRole('textbox', {
        name: NEW_PASSWORD_COPY.confirmLabel,
        exact: true,
      })
      await confirm.fill(VALID_CONFIRM_MATCH)
      await page.getByRole('button', { name: 'Show confirmation value' }).click()
      await expect(confirm).toHaveAttribute('type', 'text')
      await page.getByRole('button', { name: 'Hide confirmation value' }).click()
      await expect(confirm).toHaveAttribute('type', 'password')
      await expect(confirm).toHaveValue(VALID_CONFIRM_MATCH)
    })

    test('scrolls the privacy notice into view without leaving the page', async ({
      page,
    }) => {
      await page.getByRole('link', { name: NEW_PASSWORD_COPY.privacy }).click()
      await expect(page).toHaveURL(new RegExp(`${ROUTES.newPassword}#privacy-notice`))
      await expect(page.locator('#privacy-notice')).toBeVisible()
    })
  })

  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('loads without horizontal overflow and keeps controls reachable', async ({
      page,
    }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      )
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      )
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)

      const submit = page.getByRole('button', { name: NEW_PASSWORD_COPY.submit })
      const box = await submit.boundingBox()
      expect(box).not.toBeNull()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
      }

      await expect(
        page.getByRole('heading', { name: NEW_PASSWORD_COPY.title }),
      ).toBeVisible()
    })

    test('stacks the marketing panel beneath the form while keeping labels above inputs', async ({
      page,
    }) => {
      const passwordField = page.getByRole('textbox', {
        name: NEW_PASSWORD_COPY.passwordLabel,
        exact: true,
      })
      const passwordLabel = page.getByText(NEW_PASSWORD_COPY.passwordLabel, {
        exact: true,
      })

      const labelBox = await passwordLabel.boundingBox()
      const fieldBox = await passwordField.boundingBox()
      expect(labelBox && fieldBox).toBeTruthy()
      if (labelBox && fieldBox) {
        expect(labelBox.y).toBeLessThan(fieldBox.y)
      }

      await expect(
        page.getByText(NEW_PASSWORD_COPY.marketingHeading),
      ).toBeVisible()
    })
  })
})
