import { expect, test } from '@playwright/test'

test.describe('New password screen', () => {
  test('renders layout, branding, and form copy', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('new-password-page')).toBeVisible()
    await expect(page.getByTestId('auth-brand-panel')).toBeVisible()
    await expect(page.getByTestId('auth-brand-name')).toHaveText(/current/i)
    await expect(page.getByTestId('new-password-title')).toHaveText(
      /set your new password/i,
    )
    await expect(
      page.getByText(/differs from previously used passwords/i),
    ).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByTestId('confirm-password-input')).toBeVisible()
    await expect(page.getByTestId('submit-password')).toBeVisible()
    await expect(page.getByTestId('return-to-login')).toBeVisible()
  })

  test('password requirement rows react to input', async ({ page }) => {
    await page.goto('/')
    const rules = page.getByTestId('password-rules')

    await expect(rules.locator('li[data-met="false"]')).toHaveCount(4)

    await page.getByTestId('password-input').fill('abcdefgh')
    await expect(rules.locator('li[data-met="true"]')).toHaveCount(1)
    await expect(rules.locator('li[data-met="false"]')).toHaveCount(3)

    await page.getByTestId('password-input').fill('Abcdefgh')
    await expect(rules.locator('li[data-met="true"]')).toHaveCount(2)

    await page.getByTestId('password-input').fill('Abcdefg1')
    await expect(rules.locator('li[data-met="true"]')).toHaveCount(3)

    await page.getByTestId('password-input').fill('Abcdefg1!')
    await expect(rules.locator('li[data-met="true"]')).toHaveCount(4)
  })

  test('confirm visibility toggle and match validation', async ({ page }) => {
    await page.goto('/')
    const confirm = page.getByTestId('confirm-password-input')

    await expect(confirm).toHaveAttribute('type', 'password')
    await page.getByTestId('toggle-confirm-visibility').click()
    await expect(confirm).toHaveAttribute('type', 'text')
    await page.getByTestId('toggle-confirm-visibility').click()
    await expect(confirm).toHaveAttribute('type', 'password')

    await page.getByTestId('password-input').fill('Abcdefg1!')
    await confirm.fill('Different1!')
    await expect(page.getByTestId('password-mismatch')).toBeVisible()

    await confirm.fill('Abcdefg1!')
    await expect(page.getByTestId('password-mismatch')).toBeHidden()
  })

  test('submit enables only when rules pass and passwords match', async ({
    page,
  }) => {
    await page.goto('/')
    const submit = page.getByTestId('submit-password')

    await expect(submit).toBeDisabled()

    await page.getByTestId('password-input').fill('Abcdefg1!')
    await page.getByTestId('confirm-password-input').fill('Abcdefg1!')
    await expect(submit).toBeEnabled()
  })
})
