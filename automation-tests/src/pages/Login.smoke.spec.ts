import { test, expect } from '@playwright/test'
import { brandCopy, loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — smoke', () => {
  test('page loads, shell is visible, primary heading matches design', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    await page.goto('/')
    await expect(page.getByTestId('page-login')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: brandCopy.title }),
    ).toBeVisible()
    await expect(page.getByTestId('login-form-title')).toHaveText(
      loginData.valid.title,
    )
    expect(errors, `console errors: ${errors.join('; ')}`).toEqual([])
  })
})
