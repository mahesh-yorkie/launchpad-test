import { test, expect } from '@playwright/test'
import { loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — edge', () => {
  test('rapid retyping the password does not break rule rendering', async ({
    page,
  }) => {
    await page.goto('/')
    const pwd = page.getByTestId('input-password')
    for (let i = 0; i < 5; i += 1) {
      await pwd.fill('x'.repeat(3 + i))
    }
    await expect(page.getByTestId('password-rules-list')).toBeVisible()
  })

  test('edge-like characters are accepted as text input and do not crash the page', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByTestId('input-password').fill(loginData.edge.xssLike)
    await expect(page.getByTestId('page-login')).toBeVisible()
  })
})
