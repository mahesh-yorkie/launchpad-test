import { Link } from 'react-router-dom'

import { ROUTES } from '@/const/routes'

export function LoginPage() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-background px-4 py-10 text-center text-foreground">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This is a prototype login screen. Use the link below to open the new
        password flow.
      </p>
      <Link
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        to={ROUTES.newPassword}
      >
        Go to new password
      </Link>
    </main>
  )
}
