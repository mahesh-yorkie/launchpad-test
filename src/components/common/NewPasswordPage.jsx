import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LogIn, XCircle } from 'lucide-react'
import { AuthSplitLayout } from '@/components/common/AuthSplitLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const REQUIREMENTS = [
  { id: 'min8', label: 'Minimum 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'At least 1 uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'number', label: 'At least 1 number', test: (v) => /[0-9]/.test(v) },
  { id: 'special', label: 'At least 1 special character', test: (v) =>
    /[^A-Za-z0-9]/.test(v) },
]

function getRequirementStatus(password) {
  return REQUIREMENTS.map((r) => ({ ...r, pass: r.test(password) }))
}

export function NewPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const status = useMemo(
    () => getRequirementStatus(password),
    [password],
  )

  return (
    <AuthSplitLayout pageTestId="new-password-page">
      <div
        className="w-full max-w-[var(--layout-card-max)] space-y-[var(--layout-section-gap)] rounded-[var(--radius-lg)] border border-border bg-card px-[var(--layout-card-pad-x)] py-[var(--layout-card-pad-y)] text-card-foreground shadow-[var(--shadow-card)]"
        data-testid="new-password-card"
      >
        <header
          className="space-y-[var(--layout-title-gap)] text-left"
          data-testid="new-password-header"
        >
          <h1
            className="text-2xl font-semibold leading-tight tracking-tight text-foreground"
            data-testid="new-password-title"
          >
            Set your new password
          </h1>
          <p
            className="text-sm leading-relaxed text-muted-foreground"
            data-testid="new-password-subtitle"
          >
            Ensure that your new password differs from previously used
            passwords.
          </p>
        </header>

        <form
          className="space-y-[var(--layout-field-gap)] text-left"
          onSubmit={(e) => e.preventDefault()}
          data-testid="new-password-form"
          noValidate
        >
          <div className="space-y-2" data-testid="field-password">
            <Label htmlFor="new-password" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-new-password"
            />
          </div>

          <div className="space-y-2" data-testid="field-confirm">
            <Label htmlFor="confirm-password" className="text-muted-foreground">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
                className="pr-11"
                data-testid="input-confirm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                aria-pressed={showConfirm}
                aria-label={
                  showConfirm ? 'Hide password' : 'Show password'
                }
                data-testid="toggle-confirm-visibility"
              >
                {showConfirm ? (
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          <ul
            className="space-y-2.5 !mt-[2px] pt-1"
            aria-live="polite"
            data-testid="password-requirements"
          >
            {status.map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-2 text-sm"
                data-testid={`req-${row.id}`}
                data-state={row.pass ? 'pass' : 'fail'}
              >
                {row.pass ? (
                  <CheckCircle2
                    className="h-4 w-4 flex-shrink-0 text-success"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : (
                  <XCircle
                    className="text-destructive h-4 w-4 flex-shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                )}
                <span
                  className={
                    row.pass ? 'text-foreground' : 'text-destructive'
                  }
                >
                  {row.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="!mt-6">
            <Button
              type="submit"
              data-testid="submit-new-password"
            >
              <LogIn className="h-4 w-4" strokeWidth={2} aria-hidden />
              Login
            </Button>
          </div>
        </form>

        <p className="!mt-2 text-center">
          <a
            className="inline-flex items-center justify-center gap-1.5 text-sm text-foreground no-underline transition-[opacity,box-shadow] visited:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:opacity-80"
            href="#login"
            data-testid="back-to-login"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 text-muted-foreground"
              strokeWidth={2.25}
              aria-hidden
            />
            <span>Return to the login screen</span>
          </a>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
