import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LOGIN_COPY } from '@/const/login'
import { ROUTES } from '@/const/routes'
import { PROTOTYPE_VALID_LOGIN } from '@/mocks/data/auth-login'
import { server } from '@/mocks/server'
import {
  getLastForgotPasswordEmail,
  getLastLoginEmail,
} from '@/mocks/store/auth-store'
import { DashboardPage } from '@/pages/DashboardPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'

function renderLoginFlow(initialPath = ROUTES.login) {
  const router = createMemoryRouter(
    [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.dashboard, element: <DashboardPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
    ],
    { initialEntries: [initialPath] },
  )

  render(<RouterProvider router={router} />)
  return { router }
}

describe('LoginPage', () => {
  describe('Happy Flow', () => {
    it('renders the title, subtitle, fields, primary action, and forgot-password link', () => {
      renderLoginFlow()

      expect(screen.getByRole('heading', { name: LOGIN_COPY.title })).toBeVisible()
      expect(screen.getByText(LOGIN_COPY.subtitle)).toBeVisible()
      expect(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
      ).toBeVisible()
      expect(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
      ).toBeVisible()
      expect(
        screen.getByRole('button', { name: LOGIN_COPY.submit }),
      ).toBeVisible()
      expect(
        screen.getByRole('link', { name: LOGIN_COPY.forgotPassword }),
      ).toHaveAttribute('href', ROUTES.forgotPassword)
      expect(
        screen.getByPlaceholderText(LOGIN_COPY.emailPlaceholder),
      ).toBeVisible()
    })

    it('submits valid credentials and lands on the dashboard route', async () => {
      const user = userEvent.setup()
      const { router } = renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTES.dashboard),
      )
      expect(screen.getByRole('heading', { name: 'Signed in' })).toBeVisible()
      expect(getLastLoginEmail()).toBe(PROTOTYPE_VALID_LOGIN.email)
    })

    it('passes navigation state with the trimmed email after a successful login', async () => {
      const user = userEvent.setup()
      const { router } = renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        `  ${PROTOTYPE_VALID_LOGIN.email}  `,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTES.dashboard),
      )
      expect(router.state.location.state).toEqual({
        email: PROTOTYPE_VALID_LOGIN.email,
      })
    })
  })

  describe('Error & Negative Cases', () => {
    it('shows both field errors when the form is submitted completely empty', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Email is required', { exact: true }),
      ).toBeVisible()
      expect(
        screen.getByText('Password is required', { exact: true }),
      ).toBeVisible()
    })

    it('shows only the password error when the email is filled but password is empty', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Password is required', { exact: true }),
      ).toBeVisible()
      expect(
        screen.queryByText('Email is required', { exact: true }),
      ).not.toBeInTheDocument()
    })

    it('shows only the email error when the password is filled but email is empty', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Email is required', { exact: true }),
      ).toBeVisible()
      expect(
        screen.queryByText('Password is required', { exact: true }),
      ).not.toBeInTheDocument()
    })

    it('shows the email format error for an invalid address', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        'not-an-email',
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Enter a valid email address', { exact: true }),
      ).toBeVisible()
    })

    it('shows the minimum-length password error when the password is too short', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        'short',
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Password must be at least 8 characters', {
          exact: true,
        }),
      ).toBeVisible()
    })

    it('shows invalid credentials when the password does not match the prototype account', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        'WrongPass1!',
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(await screen.findByText('Invalid credentials')).toBeVisible()
    })

    it('surfaces the server message when the handler responds with HTTP 500', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/login', () =>
          HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 }),
        ),
      )
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Unexpected server error'),
      ).toBeVisible()
    })

    it('treats whitespace-only email as empty', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        '      ',
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      expect(
        await screen.findByText('Email is required', { exact: true }),
      ).toBeVisible()
    })
  })

  describe('Edge Cases', () => {
    it('submits when Enter is pressed from the password field', async () => {
      const user = userEvent.setup()
      const { router } = renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        `${PROTOTYPE_VALID_LOGIN.password}{Enter}`,
      )

      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTES.dashboard),
      )
    })

    it('prevents duplicate submissions while the login request is in flight', async () => {
      const user = userEvent.setup()
      let releaseRequest: (() => void) | undefined
      const gate = new Promise<void>((resolve) => {
        releaseRequest = resolve
      })

      server.use(
        http.post('/api/auth/login', async () => {
          await gate
          return HttpResponse.json({
            ok: true,
            email: PROTOTYPE_VALID_LOGIN.email,
          })
        }),
      )

      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )

      const submit = screen.getByRole('button', { name: LOGIN_COPY.submit })
      await user.click(submit)
      await waitFor(() => expect(submit).toBeDisabled())
      releaseRequest?.()

      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Signed in' })).toBeVisible(),
      )
    })

    it('toggles password visibility without clearing the typed value', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      const field = screen.getByLabelText(LOGIN_COPY.passwordLabel)
      await user.type(field, PROTOTYPE_VALID_LOGIN.password)

      await user.click(screen.getByRole('button', { name: 'Show password value' }))
      expect(field).toHaveAttribute('type', 'text')

      await user.click(screen.getByRole('button', { name: 'Hide password value' }))
      expect(field).toHaveAttribute('type', 'password')
      expect(field).toHaveValue(PROTOTYPE_VALID_LOGIN.password)
    })

    it('does not record a login when client validation fails', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      await screen.findByText('Email is required', { exact: true })
      expect(getLastLoginEmail()).toBeNull()
      expect(getLastForgotPasswordEmail()).toBeNull()
    })

    it('re-enables submit after a failed login attempt', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/login', () =>
          HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 }),
        ),
      )
      renderLoginFlow()

      await user.type(
        screen.getByLabelText(LOGIN_COPY.emailLabel),
        PROTOTYPE_VALID_LOGIN.email,
      )
      await user.type(
        screen.getByLabelText(LOGIN_COPY.passwordLabel),
        PROTOTYPE_VALID_LOGIN.password,
      )
      const submit = screen.getByRole('button', { name: LOGIN_COPY.submit })
      await user.click(submit)

      await waitFor(() => expect(submit).not.toBeDisabled())
    })
  })

  describe('Keyboard & Accessibility', () => {
    it('associates the email field with its validation error via aria-describedby', async () => {
      const user = userEvent.setup()
      renderLoginFlow()

      const field = screen.getByLabelText(LOGIN_COPY.emailLabel)
      await user.click(screen.getByRole('button', { name: LOGIN_COPY.submit }))

      const message = await screen.findByText('Email is required', { exact: true })
      const describedBy = field.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      expect(describedBy).toContain(message.id)
    })
  })
})
