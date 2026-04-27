import {
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  Waves,
  XCircle,
} from 'lucide-react'
import { type FormEvent, useId, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NEW_PASSWORD_COPY } from '@/const/new-password'
import { ROUTES } from '@/const/routes'

import brandPanel from '@/assets/new-password-brand-panel.png'

function usePasswordRules(password: string) {
  return useMemo(
    () => ({
      minLen: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  )
}

export function NewPasswordPage() {
  const navigate = useNavigate()
  const passwordFieldId = useId()
  const confirmFieldId = useId()
  const passwordErrorId = `${passwordFieldId}-error`
  const confirmErrorId = `${confirmFieldId}-error`
  const submitErrorId = `${passwordFieldId}-submit-error`

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string
    confirm?: string
  }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const rules = usePasswordRules(password)
  const allRulesMet = rules.minLen && rules.upper && rules.number && rules.special

  function validate() {
    const next: typeof fieldErrors = {}
    if (!password.trim()) {
      next.password = 'Password is required'
    } else if (!allRulesMet) {
      next.password = 'Password must satisfy every requirement below'
    }
    if (!confirm.trim()) {
      next.confirm = 'Confirm New Password is required'
    } else if (confirm !== password) {
      next.confirm = 'Passwords do not match'
    }
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword: confirm }),
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
      <aside
        className="relative order-2 flex min-h-[320px] flex-col justify-between gap-10 overflow-hidden px-6 py-8 text-white md:min-h-[420px] md:px-8 md:py-10 lg:order-1 lg:min-h-0 lg:px-10 lg:py-12"
        aria-label="Brand"
      >
        <img
          src={brandPanel}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-foreground/35"
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 md:size-12">
            <Waves aria-hidden className="size-6 text-white" strokeWidth={1.75} />
          </span>
          <span className="text-lg font-semibold tracking-[0.12em] md:text-xl">
            {NEW_PASSWORD_COPY.brandName}
          </span>
        </div>
        <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 md:gap-5">
          <h1 className="text-balance text-2xl font-semibold leading-tight md:text-3xl lg:text-[32px] lg:leading-[40px]">
            {NEW_PASSWORD_COPY.marketingHeading}
          </h1>
          <p className="max-w-[420px] text-pretty text-sm leading-relaxed text-white/90 md:text-base lg:text-[16px] lg:leading-[26px]">
            {NEW_PASSWORD_COPY.marketingBody}
          </p>
        </div>
        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80 md:text-sm">
          <span>{NEW_PASSWORD_COPY.copyright}</span>
          <a
            href="#privacy-notice"
            className="inline-flex min-h-[44px] items-center rounded-sm px-2 underline-offset-4 hover:underline sm:min-h-0 sm:px-0"
          >
            {NEW_PASSWORD_COPY.privacy}
          </a>
        </footer>
        <div id="privacy-notice" className="sr-only" tabIndex={-1}>
          Privacy details are not part of this prototype; this anchor keeps the
          control keyboard-accessible without leaving the screen.
        </div>
      </aside>

      <main className="order-1 flex items-center justify-center bg-background px-4 py-10 md:px-6 md:py-12 lg:order-2 lg:px-[40px] lg:py-[48px]">
        <div className="w-full max-w-[480px] rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
          <div className="mb-8 space-y-2 md:mb-10">
            <h2 className="text-balance text-xl font-semibold tracking-tight text-card-foreground md:text-2xl lg:text-[28px] lg:leading-[34px]">
              {NEW_PASSWORD_COPY.title}
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[22px]">
              {NEW_PASSWORD_COPY.description}
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor={passwordFieldId}>{NEW_PASSWORD_COPY.passwordLabel}</Label>
              <Input
                id={passwordFieldId}
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? passwordErrorId : undefined
                }
              />
              {fieldErrors.password ? (
                <p
                  id={passwordErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={confirmFieldId}>{NEW_PASSWORD_COPY.confirmLabel}</Label>
              <div className="relative">
                <Input
                  id={confirmFieldId}
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="pr-12"
                  aria-invalid={Boolean(fieldErrors.confirm)}
                  aria-describedby={
                    fieldErrors.confirm ? confirmErrorId : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-[var(--radius)] text-muted-foreground hover:bg-muted hover:text-foreground sm:right-0.5 sm:min-h-9 sm:min-w-9"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={
                    showConfirm ? 'Hide confirmation value' : 'Show confirmation value'
                  }
                >
                  {showConfirm ? (
                    <Eye aria-hidden className="size-4" />
                  ) : (
                    <EyeOff aria-hidden className="size-4" />
                  )}
                </button>
              </div>
              {fieldErrors.confirm ? (
                <p
                  id={confirmErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.confirm}
                </p>
              ) : null}
            </div>

            <ul className="flex flex-col gap-[10px] text-sm md:text-[14px] md:leading-[20px]" aria-live="polite">
              <li className="flex items-start gap-2">
                {rules.minLen ? (
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-chart-2"
                  />
                ) : (
                  <XCircle
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-destructive"
                  />
                )}
                <span
                  className={
                    rules.minLen ? 'text-chart-2' : 'text-destructive'
                  }
                >
                  {NEW_PASSWORD_COPY.requirementMin}
                </span>
              </li>
              <li className="flex items-start gap-2">
                {rules.upper ? (
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-chart-2"
                  />
                ) : (
                  <XCircle
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-destructive"
                  />
                )}
                <span
                  className={
                    rules.upper ? 'text-chart-2' : 'text-destructive'
                  }
                >
                  {NEW_PASSWORD_COPY.requirementUpper}
                </span>
              </li>
              <li className="flex items-start gap-2">
                {rules.number ? (
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-chart-2"
                  />
                ) : (
                  <XCircle
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-destructive"
                  />
                )}
                <span
                  className={
                    rules.number ? 'text-chart-2' : 'text-destructive'
                  }
                >
                  {NEW_PASSWORD_COPY.requirementNumber}
                </span>
              </li>
              <li className="flex items-start gap-2">
                {rules.special ? (
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-chart-2"
                  />
                ) : (
                  <XCircle
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-destructive"
                  />
                )}
                <span
                  className={
                    rules.special ? 'text-chart-2' : 'text-destructive'
                  }
                >
                  {NEW_PASSWORD_COPY.requirementSpecial}
                </span>
              </li>
            </ul>

            {submitError ? (
              <p id={submitErrorId} className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full min-h-[44px] gap-2 text-base sm:text-sm"
              disabled={loading}
            >
              <LogIn aria-hidden className="size-4" />
              {NEW_PASSWORD_COPY.submit}
            </Button>

            <div className="pt-1 text-center">
              <Link
                className="inline-flex min-h-[44px] items-center justify-center text-sm font-medium text-card-foreground underline-offset-4 hover:underline sm:min-h-0"
                to={ROUTES.login}
              >
                {NEW_PASSWORD_COPY.backToLogin}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
