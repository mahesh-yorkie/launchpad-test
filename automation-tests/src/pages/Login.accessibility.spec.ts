import { test, expect } from '@playwright/test'
import { brandCopy, loginData } from '../../fixtures/mock-data/login.data'

test.describe('Login (set password) — accessibility', () => {
  test('password inputs are labeled and the primary form title is a heading', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('label-password')).toBeVisible()
    await expect(page.getByTestId('label-confirm-password')).toBeVisible()
    await expect(page.getByText(loginData.valid.title, { exact: true })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: brandCopy.title }),
    ).toBeVisible()
  })

  test('submit is reachable with keyboard and link has a visible name', async ({
    page,
  }) => {
    await page.goto('/')
    const back = page.getByTestId('link-back-to-login')
    const submit = page.getByRole('button', { name: 'Login' })
    await submit.focus()
    await expect(submit).toBeFocused()
    await back.focus()
    await expect(back).toBeVisible()
    await expect(page.getByText('Return to the login screen')).toBeVisible()
  })
})
