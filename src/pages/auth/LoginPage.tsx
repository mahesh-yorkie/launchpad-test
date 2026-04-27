import { Eye, EyeOff, LogIn } from 'lucide-react'
import { type FormEvent, useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthBrandedAside } from '@/components/common/AuthBrandedAside'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LOGIN_COPY } from '@/const/login'
import { ROUTES } from '@/const/routes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const navigate = useNavigate()
  const emailFieldId = useId()
  const passwordFieldId = useId()
  const emailErrorId = `${emailFieldId}-error`
  const passwordErrorId = `${passwordFieldId}-error`
  const submitErrorId = `${emailFieldId}-submit-error`

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailDescribedBy =
    [errors.email ? emailErrorId : null, submitError ? submitErrorId : null]
      .filter(Boolean)
      .join(' ') || undefined

  const passwordDescribedBy =
    [errors.password ? passwordErrorId : null, submitError ? submitErrorId : null]
      .filter(Boolean)
      .join(' ') || undefined

  function validate() {
    const next: typeof errors = {}
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      next.email = 'Email is required'
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = 'Enter a valid email address'
    }
    if (!password) {
      next.password = 'Password is required'
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string
        } | null
        setSubmitError(payload?.message ?? 'Something went wrong. Try again.')
        return
      }
      navigate(ROUTES.dashboard, {
        replace: true,
        state: { email: email.trim() },
      })
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
              {LOGIN_COPY.title}
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[22px]">
              {LOGIN_COPY.subtitle}
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor={emailFieldId}>{LOGIN_COPY.emailLabel}</Label>
              {/* design-mismatch: figma shows a brighter teal stroke on the email field; using border-primary */}
              <Input
                id={emailFieldId}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={LOGIN_COPY.emailPlaceholder}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  if (submitError) setSubmitError(null)
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={emailDescribedBy}
                className="border-primary focus-visible:border-primary focus-visible:ring-primary"
              />
              {errors.email ? (
                <p id={emailErrorId} className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={passwordFieldId}>{LOGIN_COPY.passwordLabel}</Label>
              <div className="relative">
                <Input
                  id={passwordFieldId}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }))
                    }
                    if (submitError) setSubmitError(null)
                  }}
                  className="pr-12"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={passwordDescribedBy}
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-[var(--radius)] text-muted-foreground hover:bg-muted hover:text-foreground sm:right-0.5 sm:min-h-9 sm:min-w-9"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? 'Hide password value' : 'Show password value'
                  }
                >
                  {showPassword ? (
                    <Eye aria-hidden className="size-4" />
                  ) : (
                    <EyeOff aria-hidden className="size-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p
                  id={passwordErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.password}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p id={submitErrorId} className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="h-11 w-full min-h-[44px] gap-2 sm:w-auto sm:min-w-[140px]"
                disabled={loading}
              >
                <LogIn aria-hidden className="size-4" />
                {LOGIN_COPY.submit}
              </Button>
              <Link
                className="inline-flex min-h-[44px] w-full items-center justify-center text-center text-sm font-semibold text-card-foreground underline-offset-4 hover:underline sm:w-auto sm:justify-end"
                to={ROUTES.forgotPassword}
              >
                {LOGIN_COPY.forgotPassword}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
