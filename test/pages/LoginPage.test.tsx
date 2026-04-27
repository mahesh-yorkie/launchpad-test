import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/const/routes'
import { LoginPage } from '@/pages/auth/LoginPage'
import { NewPasswordPage } from '@/pages/auth/NewPasswordPage'

describe('LoginPage', () => {
  it('renders without errors when the route is visited', () => {
    const router = createMemoryRouter(
      [
        { path: ROUTES.login, element: <LoginPage /> },
        { path: ROUTES.newPassword, element: <NewPasswordPage /> },
      ],
      { initialEntries: [ROUTES.login] },
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Forgot password' })).toHaveAttribute(
      'href',
      ROUTES.forgotPassword,
    )
    expect(
      screen.getByRole('link', { name: 'Go to new password' }),
    ).toHaveAttribute('href', ROUTES.newPassword)
  })
})
