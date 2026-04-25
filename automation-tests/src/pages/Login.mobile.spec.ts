import { test, expect } from '@playwright/test'
import { loginData } from '../../fixtures/mock-data/login.data'

const viewports = [
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x800', width: 360, height: 800 },
  { name: '768x1024', width: 768, height: 1024 },
] as const

for (const v of viewports) {
  test.describe(`Login — mobile / ${v.name}`, () => {
    test.use({ viewport: { width: v.width, height: v.height } })
    test('form remains visible and tappable on small viewports', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(page.getByTestId('page-login-form-panel')).toBeInViewport()
      await expect(
        page.getByRole('heading', { name: loginData.valid.title }),
      ).toBeVisible()
      await page.getByTestId('input-confirm-visibility').click()
      await expect(page.getByTestId('input-confirm-password')).toBeVisible()
    })
  })
}
