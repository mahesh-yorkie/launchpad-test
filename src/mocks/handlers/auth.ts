import { http, HttpResponse } from 'msw'

import {
  recordForgotPasswordEmail,
  recordSetPasswordSubmission,
} from '@/mocks/store/auth-store'

function readMockError() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('mock-error')
}

async function randomDelay() {
  await new Promise((r) => setTimeout(r, 150 + Math.floor(Math.random() * 250)))
}

export const authHandlers = [
  http.post('/api/auth/forgot-password', async ({ request }) => {
    await randomDelay()
    const mode = readMockError()
    if (mode === 'forgot-password-500') {
      return HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 })
    }
    if (mode === 'forgot-password-404') {
      return HttpResponse.json({ message: 'No account found for that email' }, { status: 404 })
    }
    if (mode === 'forgot-password-401') {
      return HttpResponse.json({ message: 'Session expired' }, { status: 401 })
    }
    if (mode === 'forgot-password-409') {
      return HttpResponse.json({ message: 'Reset already pending' }, { status: 409 })
    }
    const body = (await request.json().catch(() => null)) as { email?: string } | null
    if (!body || typeof body.email !== 'string') {
      return HttpResponse.json({ message: 'Invalid payload' }, { status: 422 })
    }
    const email = body.email.trim()
    if (!email) {
      return HttpResponse.json({ message: 'Email is required' }, { status: 422 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json({ message: 'Invalid email address' }, { status: 422 })
    }
    recordForgotPasswordEmail(email)
    return HttpResponse.json({ ok: true })
  }),
  http.post('/api/auth/set-password', async ({ request }) => {
    await randomDelay()
    const mode = readMockError()
    if (mode === 'set-password-500') {
      return HttpResponse.json({ message: 'Unexpected server error' }, { status: 500 })
    }
    if (mode === 'set-password-422') {
      return HttpResponse.json({ message: 'Invalid payload' }, { status: 422 })
    }
    const body = (await request.json().catch(() => null)) as {
      password?: string
      confirmPassword?: string
    } | null
    if (!body?.password || !body.confirmPassword) {
      return HttpResponse.json({ message: 'Validation failed' }, { status: 400 })
    }
    recordSetPasswordSubmission({
      password: body.password,
      confirmPassword: body.confirmPassword,
    })
    return HttpResponse.json({ ok: true })
  }),
]
