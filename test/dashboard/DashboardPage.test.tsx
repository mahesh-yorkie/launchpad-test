import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/const/routes'
import { DashboardPage } from '@/pages/DashboardPage'

describe('DashboardPage', () => {
  it('renders without errors when the route is hit', () => {
    const router = createMemoryRouter(
      [{ path: ROUTES.dashboard, element: <DashboardPage /> }],
      { initialEntries: [ROUTES.dashboard] },
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Signed in' })).toBeVisible()
  })

  it('shows the signed-in email when navigation state includes it', () => {
    const router = createMemoryRouter(
      [{ path: ROUTES.dashboard, element: <DashboardPage /> }],
      {
        initialEntries: [
          {
            pathname: ROUTES.dashboard,
            state: { email: 'john.doe@testmail.com' },
          },
        ],
      },
    )

    render(<RouterProvider router={router} />)

    expect(
      screen.getByText(/You are signed in as john\.doe@testmail\.com/),
    ).toBeVisible()
  })
})
