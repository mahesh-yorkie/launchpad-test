import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { NEW_PASSWORD_COPY } from '@/const/new-password'
import { ROUTES } from '@/const/routes'
import { server } from '@/mocks/server'
import { getLastSetPasswordSubmission } from '@/mocks/store/auth-store'
import { LoginPage } from '@/pages/auth/LoginPage'
import { NewPasswordPage } from '@/pages/auth/NewPasswordPage'
import {
  LONG_PASSWORD,
  PASSWORD_MISSING_NUMBER,
  PASSWORD_MISSING_SPECIAL,
  PASSWORD_MISSING_UPPER,
  PASSWORD_TOO_SHORT,
  VALID_CONFIRM_MATCH,
  VALID_NEW_PASSWORD,
} from './fixtures/password-fixtures'

function renderNewPasswordFlow(initialPath = ROUTES.newPassword) {
  const router = createMemoryRouter(
    [
      { path: ROUTES.newPassword, element: <NewPasswordPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
    ],
    { initialEntries: [initialPath] },
  )

  render(<RouterProvider router={router} />)
  return { router }
}

describe('NewPasswordPage', () => {
  describe('Happy Flow', () => {
    it('renders every field, validation row, and copy from the design constants', () => {
      renderNewPasswordFlow()

      expect(
        screen.getByRole('heading', { name: NEW_PASSWORD_COPY.title }),
      ).toBeVisible()
      expect(screen.getByText(NEW_PASSWORD_COPY.description)).toBeVisible()
      expect(screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel)).toBeVisible()
      expect(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
      ).toBeVisible()
      expect(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      ).toBeVisible()
      expect(
        screen.getByRole('link', { name: NEW_PASSWORD_COPY.backToLogin }),
      ).toHaveAttribute('href', ROUTES.login)
      expect(
        screen.getByText(NEW_PASSWORD_COPY.requirementMin),
      ).toBeVisible()
      expect(
        screen.getByText(NEW_PASSWORD_COPY.requirementUpper),
      ).toBeVisible()
      expect(
        screen.getByText(NEW_PASSWORD_COPY.requirementNumber),
      ).toBeVisible()
      expect(
        screen.getByText(NEW_PASSWORD_COPY.requirementSpecial),
      ).toBeVisible()
    })

    it('submits when all requirements are satisfied and navigates to the login route', async () => {
      const user = userEvent.setup()
      const { router } = renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        VALID_CONFIRM_MATCH,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTES.login),
      )
      expect(screen.getByRole('heading', { name: 'Sign in' })).toBeVisible()
      expect(getLastSetPasswordSubmission()?.password).toBe(VALID_NEW_PASSWORD)
    })

    it('marks every requirement as satisfied once the password meets all rules', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )

      for (const label of [
        NEW_PASSWORD_COPY.requirementMin,
        NEW_PASSWORD_COPY.requirementUpper,
        NEW_PASSWORD_COPY.requirementNumber,
        NEW_PASSWORD_COPY.requirementSpecial,
      ]) {
        expect(screen.getByText(label)).toHaveClass('text-chart-2')
      }
    })
  })

  describe('Error & Negative Cases', () => {
    it('shows every required-field error when the form is submitted empty', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Password is required')).toBeVisible()
      expect(
        screen.getByText('Confirm New Password is required'),
      ).toBeVisible()
    })

    it('shows only the confirm error when the password is valid but confirmation is empty', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText('Confirm New Password is required'),
      ).toBeVisible()
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument()
    })

    it('shows only the password error when confirmation is filled but password is empty', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        VALID_NEW_PASSWORD,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Password is required')).toBeVisible()
      expect(
        screen.queryByText('Confirm New Password is required'),
      ).not.toBeInTheDocument()
    })

    it('blocks submit when uppercase requirement fails and surfaces the password guidance', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        PASSWORD_MISSING_UPPER,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        PASSWORD_MISSING_UPPER,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText(
          'Password must satisfy every requirement below',
        ),
      ).toBeVisible()
    })

    it('shows the mismatch message when confirmation does not match the password', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        `${VALID_NEW_PASSWORD}extra`,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Passwords do not match')).toBeVisible()
    })

    it('surfaces the server message when the handler responds with HTTP 500', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/set-password', () =>
          HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 }),
        ),
      )
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        VALID_CONFIRM_MATCH,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText('Unexpected server error'),
      ).toBeVisible()
      expect(screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel)).toHaveValue(
        VALID_NEW_PASSWORD,
      )
    })

    it('treats whitespace-only passwords as empty and shows the required error', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        '      ',
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        '      ',
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Password is required')).toBeVisible()
    })
  })

  describe('Edge Cases', () => {
    it('submits the form when Enter is pressed from the confirmation field', async () => {
      const user = userEvent.setup()
      const { router } = renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        `${VALID_CONFIRM_MATCH}{Enter}`,
      )

      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTES.login),
      )
    })

    it('prevents duplicate submissions while the request is in flight', async () => {
      const user = userEvent.setup()
      let releaseRequest: (() => void) | undefined
      const gate = new Promise<void>((resolve) => {
        releaseRequest = resolve
      })

      server.use(
        http.post('/api/auth/set-password', async () => {
          await gate
          return HttpResponse.json({ ok: true })
        }),
      )

      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        VALID_NEW_PASSWORD,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        VALID_CONFIRM_MATCH,
      )

      const submit = screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit })
      await user.click(submit)
      expect(submit).toBeDisabled()
      await user.click(submit)
      releaseRequest?.()

      await waitFor(() => expect(submit).not.toBeDisabled())
    })

    it('allows pasting a very long password without crashing the page', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      const password = screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel)
      await user.click(password)
      await user.paste(LONG_PASSWORD)

      expect(password).toHaveValue(LONG_PASSWORD)
    })

    it('toggles the confirmation field between password and text when the visibility control is used', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      const confirm = screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel)
      expect(confirm).toHaveAttribute('type', 'password')

      await user.click(
        screen.getByRole('button', { name: 'Show confirmation value' }),
      )
      expect(confirm).toHaveAttribute('type', 'text')

      await user.click(
        screen.getByRole('button', { name: 'Hide confirmation value' }),
      )
      expect(confirm).toHaveAttribute('type', 'password')
    })

    it('updates the numeric requirement row when digits are added', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        PASSWORD_MISSING_NUMBER,
      )

      expect(screen.getByText(NEW_PASSWORD_COPY.requirementNumber)).toHaveClass(
        'text-destructive',
      )

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        '9',
      )

      await waitFor(() =>
        expect(
          screen.getByText(NEW_PASSWORD_COPY.requirementNumber),
        ).toHaveClass('text-chart-2'),
      )
    })

    it('shows guidance when special characters are missing from an otherwise long password', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        PASSWORD_MISSING_SPECIAL,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        PASSWORD_MISSING_SPECIAL,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText(
          'Password must satisfy every requirement below',
        ),
      ).toBeVisible()
    })

    it('shows guidance when the password is shorter than eight characters', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel),
        PASSWORD_TOO_SHORT,
      )
      await user.type(
        screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel),
        PASSWORD_TOO_SHORT,
      )
      await user.click(
        screen.getByRole('button', { name: NEW_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText(
          'Password must satisfy every requirement below',
        ),
      ).toBeVisible()
    })
  })

  describe('Keyboard & Accessibility', () => {
    it('moves focus from the password field to the confirmation field with Tab', async () => {
      const user = userEvent.setup()
      renderNewPasswordFlow()

      const password = screen.getByLabelText(NEW_PASSWORD_COPY.passwordLabel)
      const confirm = screen.getByLabelText(NEW_PASSWORD_COPY.confirmLabel)

      await user.click(password)
      await user.tab()

      expect(confirm).toHaveFocus()
    })
  })
})
