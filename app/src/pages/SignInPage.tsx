import { Link } from "react-router-dom";

export function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">Access the Current admin console.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          data-testid="go-to-forgot-password"
        >
          Forgot your password?
        </Link>
        <Link
          to="/login"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          data-testid="go-to-password-reset"
        >
          Need to set a new password?
        </Link>
      </div>
    </main>
  );
}
