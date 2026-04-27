import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { FORGOT_PASSWORD_COPY } from '@/const/forgot-password'
import { ROUTES } from '@/const/routes'
import { server } from '@/mocks/server'
import {
  getLastForgotPasswordEmail,
  getLastSetPasswordSubmission,
} from '@/mocks/store/auth-store'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import {
  INVALID_FORGOT_EMAIL,
  LONG_EMAIL_LOCAL,
  MISSING_LOCAL_EMAIL,
  SECOND_VALID_EMAIL,
  VALID_FORGOT_EMAIL,
} from './fixtures/email-fixtures'

function renderForgotPasswordFlow(initialPath = ROUTES.forgotPassword) {
  const router = createMemoryRouter(
    [
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
    ],
    { initialEntries: [initialPath] },
  )

  render(<RouterProvider router={router} />)
  return { router }
}

describe('ForgotPasswordPage', () => {
  describe('Happy Flow', () => {
    it('renders the title, description, email field, confirm action, and return link', () => {
      renderForgotPasswordFlow()

      expect(
        screen.getByRole('heading', { name: FORGOT_PASSWORD_COPY.title }),
      ).toBeVisible()
      expect(screen.getByText(FORGOT_PASSWORD_COPY.description)).toBeVisible()
      expect(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
      ).toBeVisible()
      expect(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      ).toBeVisible()
      expect(
        screen.getByRole('link', { name: FORGOT_PASSWORD_COPY.backToLogin }),
      ).toHaveAttribute('href', ROUTES.login)
      expect(
        screen.getByPlaceholderText(FORGOT_PASSWORD_COPY.emailPlaceholder),
      ).toBeVisible()
    })

    it('submits a valid email and navigates to the login route', async () => {
      const user = userEvent.setup()
      const { router } = renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      await waitFor(() =>
        expect(router.state.location.pathname).toBe(ROUTES.login),
      )
      expect(getLastForgotPasswordEmail()).toBe(VALID_FORGOT_EMAIL)
    })

    it('records the trimmed email when leading and trailing spaces are typed', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        `  ${SECOND_VALID_EMAIL}  `,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      await waitFor(() =>
        expect(getLastForgotPasswordEmail()).toBe(SECOND_VALID_EMAIL),
      )
    })
  })

  describe('Error & Negative Cases', () => {
    it('shows the required error when the form is submitted empty', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Email is required')).toBeVisible()
    })

    it('shows the format error when the email is not valid', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        INVALID_FORGOT_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText('Enter a valid email address'),
      ).toBeVisible()
    })

    it('shows the format error for a missing local part', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        MISSING_LOCAL_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText('Enter a valid email address'),
      ).toBeVisible()
    })

    it('surfaces the server message when the handler responds with HTTP 500', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/forgot-password', () =>
          HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 }),
        ),
      )
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText('Unexpected server error'),
      ).toBeVisible()
      expect(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
      ).toHaveValue(VALID_FORGOT_EMAIL)
    })

    it('surfaces the not-found message when the handler responds with HTTP 404', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/forgot-password', () =>
          HttpResponse.json(
            { message: 'No account found for that email' },
            { status: 404 },
          ),
        ),
      )
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(
        await screen.findByText('No account found for that email'),
      ).toBeVisible()
    })

    it('treats whitespace-only input as empty', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        '      ',
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Email is required')).toBeVisible()
    })

    it('shows the conflict message when the handler responds with HTTP 409', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/forgot-password', () =>
          HttpResponse.json({ message: 'Reset already pending' }, { status: 409 }),
        ),
      )
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      expect(await screen.findByText('Reset already pending')).toBeVisible()
    })
  })

  describe('Edge Cases', () => {
    it('submits when Enter is pressed inside the email field', async () => {
      const user = userEvent.setup()
      const { router } = renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        `${VALID_FORGOT_EMAIL}{Enter}`,
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
        http.post('/api/auth/forgot-password', async () => {
          await gate
          return HttpResponse.json({ ok: true })
        }),
      )

      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )

      const submit = screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit })
      await user.click(submit)
      expect(submit).toBeDisabled()
      await user.click(submit)
      releaseRequest?.()

      await waitFor(() => expect(submit).not.toBeDisabled())
    })

    it('allows pasting a very long email without crashing the page', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      const field = screen.getByRole('textbox', {
        name: FORGOT_PASSWORD_COPY.emailLabel,
      })
      await user.click(field)
      await user.paste(LONG_EMAIL_LOCAL)

      expect(field).toHaveValue(LONG_EMAIL_LOCAL)
    })

    it('clears the client validation error after the user starts typing again', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )
      expect(await screen.findByText('Email is required')).toBeVisible()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        'j',
      )

      await waitFor(() =>
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument(),
      )
    })

    it('does not overwrite unrelated mock submissions when forgot password succeeds', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      await waitFor(() => expect(getLastForgotPasswordEmail()).toBeTruthy())
      expect(getLastSetPasswordSubmission()).toBeNull()
    })

    it('re-enables submit after a failed request so the user can retry', async () => {
      const user = userEvent.setup()
      server.use(
        http.post('/api/auth/forgot-password', () =>
          HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 }),
        ),
      )
      renderForgotPasswordFlow()

      await user.type(
        screen.getByRole('textbox', { name: FORGOT_PASSWORD_COPY.emailLabel }),
        VALID_FORGOT_EMAIL,
      )
      const submit = screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit })
      await user.click(submit)

      await waitFor(() => expect(submit).not.toBeDisabled())
    })
  })

  describe('Keyboard & Accessibility', () => {
    it('associates the email field with its validation error via aria-describedby', async () => {
      const user = userEvent.setup()
      renderForgotPasswordFlow()

      const field = screen.getByRole('textbox', {
        name: FORGOT_PASSWORD_COPY.emailLabel,
      })
      await user.click(
        screen.getByRole('button', { name: FORGOT_PASSWORD_COPY.submit }),
      )

      const message = await screen.findByText('Email is required')
      const describedBy = field.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      expect(describedBy).toContain(message.id)
    })
  })
})
