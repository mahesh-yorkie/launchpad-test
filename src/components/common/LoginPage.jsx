import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { AuthSplitLayout } from '@/components/common/AuthSplitLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const [email, setEmail] = useState('alexmora@gmail.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthSplitLayout pageTestId="login-page">
      <div
        className="w-full max-w-[var(--layout-card-max)] space-y-[var(--layout-section-gap)] rounded-[var(--radius-lg)] border border-border bg-card px-[var(--layout-card-pad-x)] py-[var(--layout-card-pad-y)] text-card-foreground shadow-[var(--shadow-card)]"
        data-testid="login-card"
      >
        <header
          className="space-y-[var(--layout-title-gap)] text-left"
          data-testid="login-header"
        >
          <h1
            className="text-2xl font-semibold leading-tight tracking-tight text-foreground"
            data-testid="login-title"
          >
            Login
          </h1>
          <p
            className="text-sm leading-relaxed text-muted-foreground"
            data-testid="login-subtitle"
          >
            Login to access your account
          </p>
        </header>

        <form
          className="space-y-[var(--layout-field-gap)] text-left"
          onSubmit={(e) => e.preventDefault()}
          data-testid="login-form"
          noValidate
        >
          <div className="space-y-2" data-testid="field-email">
            <Label htmlFor="login-email" className="text-foreground">
              Email
            </Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn('border-primary')}
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2" data-testid="field-password">
            <Label htmlFor="login-password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border pr-11"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="toggle-password-visibility"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          <div
            className="flex w-full flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between"
            data-testid="login-actions"
          >
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[140px]"
              data-testid="submit-login"
            >
              <LogIn className="h-4 w-4" strokeWidth={2} aria-hidden />
              Login
            </Button>
            <a
              className="text-center text-sm font-semibold text-foreground no-underline transition-[opacity,box-shadow] visited:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:opacity-80 sm:text-right"
              href="#forgot-password"
              data-testid="link-forgot-password"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  )
}
