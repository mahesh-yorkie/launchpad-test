import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { type FormEvent, useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthBrandedAside } from '@/components/common/AuthBrandedAside'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FORGOT_PASSWORD_COPY } from '@/const/forgot-password'
import { ROUTES } from '@/const/routes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const emailFieldId = useId()
  const emailErrorId = `${emailFieldId}-error`
  const submitErrorId = `${emailFieldId}-submit-error`

  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function validate() {
    const trimmed = email.trim()
    if (!trimmed) {
      setFieldError('Email is required')
      return false
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setFieldError('Enter a valid email address')
      return false
    }
    setFieldError(undefined)
    return true
  }

  const emailDescribedBy =
    [fieldError ? emailErrorId : null, submitError ? submitErrorId : null]
      .filter(Boolean)
      .join(' ') || undefined

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string
        } | null
        setSubmitError(payload?.message ?? 'Something went wrong. Try again.')
        return
      }
      navigate(ROUTES.login)
    } catch {
      setSubmitError('Network error. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[100svh] w-full max-w-screen-xl grid-cols-1 lg:min-h-[898px] lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
      <AuthBrandedAside />

      <main className="order-1 flex items-center justify-center bg-background px-4 py-10 md:px-6 md:py-12 lg:order-2 lg:px-[40px] lg:py-[48px]">
        <div className="w-full max-w-[480px] rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
          <div className="mb-8 space-y-2 md:mb-10">
            <h2 className="text-balance text-xl font-semibold tracking-tight text-card-foreground md:text-2xl lg:text-[28px] lg:leading-[34px]">
              {FORGOT_PASSWORD_COPY.title}
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[22px]">
              {FORGOT_PASSWORD_COPY.description}
            </p>
          </div>

          <form className="space-y-8" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor={emailFieldId}>{FORGOT_PASSWORD_COPY.emailLabel}</Label>
              {/* design-mismatch: figma shows a brighter teal stroke on the field; using border-primary */}
              <Input
                id={emailFieldId}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={FORGOT_PASSWORD_COPY.emailPlaceholder}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (fieldError) setFieldError(undefined)
                  if (submitError) setSubmitError(null)
                }}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={emailDescribedBy}
                className="border-primary focus-visible:border-primary focus-visible:ring-primary"
              />
              {fieldError ? (
                <p id={emailErrorId} className="text-sm text-destructive" role="alert">
                  {fieldError}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p id={submitErrorId} className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            ) : null}

            <div className="space-y-4">
              <Button
                type="submit"
                className="h-11 w-full min-h-[44px] gap-2 text-base sm:text-sm"
                disabled={loading}
              >
                <CheckCircle2 aria-hidden className="size-4" />
                {FORGOT_PASSWORD_COPY.submit}
              </Button>

              <div className="text-center">
                <Link
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-medium text-card-foreground underline-offset-4 hover:underline sm:min-h-0"
                  to={ROUTES.login}
                >
                  <ArrowLeft aria-hidden className="size-4 shrink-0" />
                  {FORGOT_PASSWORD_COPY.backToLogin}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
