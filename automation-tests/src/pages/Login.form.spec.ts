import { test, expect } from '@playwright/test'
import { loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — form', () => {
  test('updating password updates client-side rule indicators', async ({
    page,
  }) => {
    await page.goto('/')
    const pwd = page.getByTestId('input-password')
    const rules = page.getByTestId('password-rules-list')

    await pwd.fill('')
    await expect(rules).toBeVisible()
    await pwd.fill('short')
    await expect(rules.getByText('Minimum 8 characters')).toBeVisible()

    await pwd.fill(loginData.valid.passwordMeetsAll)
    const strongItem = rules.getByText('At least 1 special character').first()
    await expect(strongItem).toBeVisible()
  })
})
