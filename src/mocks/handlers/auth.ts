import { http, HttpResponse } from 'msw'

import { recordSetPasswordSubmission } from '@/mocks/store/auth-store'

function readMockError() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('mock-error')
}

async function randomDelay() {
  await new Promise((r) => setTimeout(r, 150 + Math.floor(Math.random() * 250)))
}

export const authHandlers = [
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
