import { useId, useState } from 'react'
import { AuthMarketingSidebar } from '../components/common/auth-marketing-sidebar.jsx'
import { AuthSplitLayout } from '../components/common/auth-split-layout.jsx'
import { Button } from '../components/ui/button.jsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export function Login() {
  const emailId = useId()
  const passwordId = useId()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthSplitLayout sidebar={<AuthMarketingSidebar />}>
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
        <Card className="w-full max-w-[var(--login-card-max-width)] border-border px-login-card-x py-login-card-y">
          <CardHeader className="space-y-2 p-0">
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to access your account</CardDescription>
          </CardHeader>

          <CardContent className="mt-8 space-y-login-field p-0">
            <div className="space-y-[var(--login-label-gap)]">
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="alexmora@gmail.com"
                className="border-primary/50 focus-visible:border-primary focus-visible:ring-primary/35"
              />
            </div>

            <div className="space-y-[var(--login-label-gap)]">
              <Label htmlFor={passwordId}>Password</Label>
              <div className="relative">
                <Input
                  id={passwordId}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border-input pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 inline-flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <Button
                type="submit"
                size="login"
                className="h-[var(--login-button-height)] shrink-0 px-8"
              >
                <LogIn className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                Login
              </Button>
              <a
                href="#/forgot-password"
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                Forgot password?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-border bg-muted/40 px-6 py-4 text-center text-sm text-muted-foreground lg:hidden">
        © 2024 Current ·{' '}
        <a className="text-foreground" href="#privacy">
          Privacy
        </a>
      </div>
    </AuthSplitLayout>
  )
}
