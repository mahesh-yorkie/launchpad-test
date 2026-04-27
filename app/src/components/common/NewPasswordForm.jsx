import { useId, useMemo, useState } from 'react'
import { CheckCircle2, LogIn, XCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function usePasswordRules(password) {
  return useMemo(
    () => ({
      min8: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  )
}

function RuleRow({ met, children }) {
  return (
    <li className="flex items-center gap-2 text-sm font-medium">
      {met ? (
        <CheckCircle2 className="size-[18px] shrink-0 text-success" strokeWidth={2.25} />
      ) : (
        <XCircle className="size-[18px] shrink-0 text-destructive" strokeWidth={2.25} />
      )}
      <span
        className={cn(
          'leading-5',
          met ? 'text-success' : 'text-destructive',
        )}
      >
        {children}
      </span>
    </li>
  )
}

export function NewPasswordForm() {
  const pwId = useId()
  const confirmId = useId()
  /* "AbcdefgH" → min length + upper pass; number + special fail (matches Figma state) */
  const [password, setPassword] = useState('AbcdefgH')
  const [confirm, setConfirm] = useState('AbcdefgH')
  const [showConfirm, setShowConfirm] = useState(false)
  const rules = usePasswordRules(password)

  return (
    <div className="flex w-full max-w-[480px] flex-col">
      <Card className="w-full border-border bg-card p-10 shadow-card">
        <CardHeader>
          <CardTitle>Set your new password</CardTitle>
          <CardDescription>
            Ensure that your new password differs from previously used passwords.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8">
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={pwId}>Password</Label>
              <Input
                id={pwId}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="pr-3.5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={confirmId}>Confirm New Password</Label>
              <div className="relative">
                <Input
                  id={confirmId}
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  className="pr-11"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-pressed={showConfirm}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              </div>
            </div>
            <ul className="flex flex-col gap-2" aria-label="Password requirements">
              <RuleRow met={rules.min8}>Minimum 8 characters</RuleRow>
              <RuleRow met={rules.upper}>At least 1 uppercase letter</RuleRow>
              <RuleRow met={rules.number}>At least 1 number</RuleRow>
              <RuleRow met={rules.special}>At least 1 special character</RuleRow>
            </ul>
            <Button type="submit" className="mt-1 w-full gap-2" size="default">
              <LogIn className="size-[18px]" />
              Login
            </Button>
            <a
              href="/login"
              className="mt-1 inline-flex w-full items-center justify-center gap-2 py-1 text-center text-base font-medium text-foreground no-underline transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Return to the login screen
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
