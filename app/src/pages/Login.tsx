import { useEffect, useId, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CircleCheck,
  LogIn,
  XCircle,
  EyeOff,
  Eye,
} from 'lucide-react'
import { AuthBrandedColumn } from '@/components/common/AuthBrandedColumn'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const DEFAULT_PASSWORD = 'Abcdefgh'

function getPasswordRuleState(password: string) {
  return {
    min8: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  } as const
}

type RuleItemProps = {
  met: boolean
  label: string
}

function RuleItem({ met, label }: RuleItemProps) {
  return (
    <li
      className={cn(
        'flex items-center gap-2 text-sm font-medium',
        met ? 'text-success' : 'text-destructive',
      )}
    >
      {met ? (
        <CircleCheck className="h-4 w-4 shrink-0 text-success" strokeWidth={2.25} />
      ) : (
        <XCircle className="h-4 w-4 shrink-0 text-destructive" strokeWidth={2.25} />
      )}
      <span>{label}</span>
    </li>
  )
}

/**
 * Figma node 2281:147 — “Login” (set new password) screen, 1440×898.
 */
export function Login() {
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [confirm, setConfirm] = useState(DEFAULT_PASSWORD)
  const [showConfirm, setShowConfirm] = useState(false)
  const idBase = useId()
  const pwdId = `${idBase}-password`
  const confId = `${idBase}-confirm`

  const rules = useMemo(() => getPasswordRuleState(password), [password])

  useEffect(() => {
    void fetch(new URL('/api/health', window.location.origin), {
      method: 'GET',
    }).catch(() => undefined)
  }, [])

  return (
    <div
      className="mx-auto flex w-full min-h-[var(--login-frame-h)] max-w-[1440px] min-h-svh flex-col md:min-h-[var(--login-frame-h)] md:h-[var(--login-frame-h)] md:flex-row"
      data-testid="page-login"
    >
      <AuthBrandedColumn className="h-[320px] min-h-0 w-full min-h-0 md:h-full md:min-h-[var(--login-frame-h)] md:w-[var(--login-left-w)]" />

      <section
        className="flex w-full min-h-0 flex-1 items-center justify-center bg-background px-8 py-10"
        data-testid="page-login-form-panel"
      >
        <Card
          className="w-full max-w-[440px] border-0 p-0 shadow-none [box-shadow:var(--shadow-card)]"
        >
          <CardContent className="p-10 sm:p-10">
            <header className="mb-8 text-left">
              <h2
                className="m-0 text-2xl font-bold leading-8 text-foreground"
                data-testid="login-form-title"
              >
                Set your new password
              </h2>
              <p
                className="mt-2 text-sm font-normal leading-5 text-muted-foreground"
                data-testid="login-form-subtitle"
              >
                Ensure that your new password differs from previously used
                passwords.
              </p>
            </header>

            <form
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
              data-testid="login-set-password-form"
            >
              <div className="space-y-1.5">
                <Label htmlFor={pwdId} data-testid="label-password">
                  Password
                </Label>
                <Input
                  id={pwdId}
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={confId} data-testid="label-confirm-password">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id={confId}
                    type={showConfirm ? 'text' : 'password'}
                    name="passwordConfirm"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pr-12"
                    data-testid="input-confirm-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="text-muted-foreground absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    data-testid="input-confirm-visibility"
                  >
                    {showConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <ul
                className="list-none space-y-2.5 p-0"
                data-testid="password-rules-list"
              >
                <RuleItem
                  met={rules.min8}
                  label="Minimum 8 characters"
                />
                <RuleItem met={rules.upper} label="At least 1 uppercase letter" />
                <RuleItem
                  met={rules.number}
                  label="At least 1 number"
                />
                <RuleItem
                  met={rules.special}
                  label="At least 1 special character"
                />
              </ul>

              <div className="pt-0">
                <Button
                  className="h-12 w-full text-base font-semibold"
                  type="submit"
                  data-testid="primary-submit"
                >
                  <LogIn className="h-5 w-5" aria-hidden />
                  Login
                </Button>
              </div>

              <p className="m-0 pt-1 text-center text-sm text-primary">
                <a
                  href="#login"
                  className="text-primary inline-flex items-center justify-center gap-1.5 font-medium hover:opacity-90"
                  data-testid="link-back-to-login"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to the login screen
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Login
