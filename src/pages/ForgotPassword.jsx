import { useId } from 'react'
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
import { ArrowLeft, CircleCheck } from 'lucide-react'

export function ForgotPassword() {
  const emailId = useId()

  return (
    <AuthSplitLayout sidebar={<AuthMarketingSidebar />}>
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
        <Card className="w-full max-w-[var(--login-card-max-width)] border-border px-login-card-x py-login-card-y">
          <CardHeader className="space-y-2 p-0">
            <CardTitle>Forgot your password</CardTitle>
            <CardDescription>
              Please enter your email address below to initiate the password
              reset process.
            </CardDescription>
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

            <Button
              type="submit"
              size="login"
              className="mt-2 h-[var(--login-button-height)] w-full"
            >
              <CircleCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              Confirm
            </Button>

            <p className="pt-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                Return to the login screen
              </a>
            </p>
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
