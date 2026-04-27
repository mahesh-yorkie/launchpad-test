import { useState } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { AuthSplitLayout } from '@/components/common/AuthSplitLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('alexmora@gmail.com')

  return (
    <AuthSplitLayout pageTestId="forgot-password-page">
      <div
        className="w-full max-w-[var(--layout-card-max)] space-y-[var(--layout-section-gap)] rounded-[var(--radius-lg)] border border-border bg-card px-[var(--layout-card-pad-x)] py-[var(--layout-card-pad-y)] text-card-foreground shadow-[var(--shadow-card)]"
        data-testid="forgot-password-card"
      >
        <header
          className="space-y-[var(--layout-title-gap)] text-left"
          data-testid="forgot-password-header"
        >
          <h1
            className="text-2xl font-semibold leading-tight tracking-tight text-foreground"
            data-testid="forgot-password-title"
          >
            Forgot your password
          </h1>
          <p
            className="text-sm leading-relaxed text-muted-foreground"
            data-testid="forgot-password-subtitle"
          >
            Please enter your email address below to initiate the password reset
            process.
          </p>
        </header>

        <form
          className="space-y-[var(--layout-field-gap)] text-left"
          onSubmit={(e) => e.preventDefault()}
          data-testid="forgot-password-form"
          noValidate
        >
          <div className="space-y-2" data-testid="field-email">
            <Label htmlFor="forgot-email" className="text-foreground">
              Email
            </Label>
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn('border-primary')}
              data-testid="input-forgot-email"
            />
          </div>

          <div className="!mt-2">
            <Button type="submit" data-testid="submit-forgot-confirm">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden />
              Confirm
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
