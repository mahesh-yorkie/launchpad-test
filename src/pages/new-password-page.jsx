import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  XCircle,
} from 'lucide-react'
import { AuthBrandPanel } from '../components/common/auth-brand-panel'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { cn } from '../lib/utils'

function PasswordRuleRow({ met, label }) {
  return (
    <li
      className="flex items-center gap-2.5 text-sm"
      data-met={met ? 'true' : 'false'}
    >
      {met ? (
        <CheckCircle2
          className="size-[18px] shrink-0 text-success"
          aria-hidden
        />
      ) : (
        <XCircle
          className="size-[18px] shrink-0 text-destructive"
          aria-hidden
        />
      )}
      <span
        className={cn(
          met ? 'text-foreground' : 'text-destructive',
          'leading-5',
        )}
      >
        {label}
      </span>
    </li>
  )
}

export function NewPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const checks = useMemo(() => {
    return {
      minLength: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
  }, [password])

  const passwordsMatch =
    password.length > 0 && confirm.length > 0 && password === confirm

  const allRulesMet = Object.values(checks).every(Boolean)
  const canSubmit = allRulesMet && passwordsMatch

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
  }

  return (
    <div
      className="flex min-h-[var(--frame-min-height)] min-h-dvh w-full bg-background"
      data-testid="new-password-page"
    >
      <AuthBrandPanel />

      <section className="flex flex-1 items-center justify-center px-8 py-12">
        <Card className="w-full max-w-[var(--form-card-max-width)] border-border px-[var(--form-card-padding-x)] py-[var(--form-card-padding-y)]">
          <CardHeader className="mb-8 space-y-2">
            <CardTitle data-testid="new-password-title">
              Set your new password
            </CardTitle>
            <CardDescription>
              Ensure that your new password differs from previously used
              passwords.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    data-testid="password-input"
                    type="password"
                    name="new-password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      data-testid="confirm-password-input"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirm-password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pr-11"
                    />
                    <button
                      type="button"
                      data-testid="toggle-confirm-visibility"
                      className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-pressed={showConfirm}
                      aria-label={
                        showConfirm ? 'Hide confirm password' : 'Show confirm password'
                      }
                    >
                      {showConfirm ? (
                        <Eye className="size-[18px]" aria-hidden />
                      ) : (
                        <EyeOff className="size-[18px]" aria-hidden />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <ul
                className="mt-6 space-y-2.5"
                aria-label="Password requirements"
                data-testid="password-rules"
              >
                <PasswordRuleRow met={checks.minLength} label="Minimum 8 characters" />
                <PasswordRuleRow
                  met={checks.upper}
                  label="At least 1 uppercase letter"
                />
                <PasswordRuleRow met={checks.number} label="At least 1 number" />
                <PasswordRuleRow
                  met={checks.special}
                  label="At least 1 special character"
                />
              </ul>

              {confirm.length > 0 && !passwordsMatch ? (
                <p
                  className="mt-3 text-sm text-destructive"
                  data-testid="password-mismatch"
                >
                  Passwords do not match.
                </p>
              ) : null}

              <Button
                className="mt-8 w-full"
                size="lg"
                type="submit"
                disabled={!canSubmit}
                data-testid="submit-password"
              >
                <LogIn className="size-[18px]" aria-hidden />
                Login
              </Button>

              <Button
                variant="ghost"
                className="mt-6 h-auto w-full gap-2 px-0 py-0 text-sm font-medium text-foreground hover:bg-transparent"
                asChild
              >
                <a href="/login" data-testid="return-to-login">
                  <ArrowLeft className="size-4" aria-hidden />
                  Return to the login screen
                </a>
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
