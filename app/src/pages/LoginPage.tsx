import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandedAuthSidebar } from "@/components/common/BrandedAuthSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const authFieldClassName = cn(
  "h-11 border-[hsl(var(--primary))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
  "focus-visible:border-[hsl(var(--primary))] focus-visible:ring-[hsl(var(--ring))]",
);

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginPage() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("alexmora@gmail.com");
  const [password, setPassword] = useState("hunter2");
  const [showPasswordPlain, setShowPasswordPlain] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const canSubmit = useMemo(() => isValidEmail(email) && password.length > 0, [email, password]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError(null);
    setSucceeded(false);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setError(body.message ?? "Request failed");
        return;
      }
      setSucceeded(true);
    } catch {
      setError("Request failed");
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  return (
    <div
      className="flex w-full min-h-svh flex-col bg-[hsl(var(--background))] min-[1440px]:h-[56.125rem] min-[1440px]:min-h-[56.125rem] lg:min-h-svh lg:flex-row"
      data-testid="login-frame"
    >
      <BrandedAuthSidebar
        footer={
          <div className="mt-6 flex w-full max-w-sm flex-col gap-1 border-t border-[hsl(var(--sidebar-foreground))]/20 pt-6 text-sm text-[hsl(var(--sidebar-foreground))]/80 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2024 Current</span>
            <Link
              to="#"
              className="text-[hsl(var(--sidebar-foreground))] underline decoration-[hsl(var(--sidebar-foreground))]/30 underline-offset-2 hover:decoration-[hsl(var(--sidebar-foreground))]"
              data-testid="auth-privacy"
            >
              Privacy
            </Link>
          </div>
        }
      >
        <div
          className="flex w-full max-w-sm flex-col gap-6"
          data-testid="auth-sidebar-hero"
        >
          <h2 className="m-0 text-3xl font-bold leading-tight text-[hsl(var(--sidebar-foreground))] lg:max-w-[20rem] lg:text-[1.9rem] lg:leading-9">
            Track, Schedule, and Optimize Your Pool Services
          </h2>
          <p className="m-0 max-w-[22rem] text-sm leading-6 text-[hsl(var(--sidebar-muted))]">
            Effortlessly track every aspect of your services, from client
            appointments to job progress, ensuring that no detail is overlooked.
          </p>
        </div>
      </BrandedAuthSidebar>

      <div
        className="flex w-full min-w-0 flex-1 items-center justify-center px-6 py-10 lg:px-20 lg:py-12"
        data-testid="auth-main"
        role="main"
      >
        <div className="w-full max-w-md lg:max-w-lg" data-testid="auth-right-panel">
          <Card className="w-full max-w-md" data-testid="auth-card">
            <form onSubmit={onSubmit} className="flex w-full flex-col" noValidate>
              <CardHeader>
                <h1 className="m-0 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-[1.5rem]">
                  Login
                </h1>
                <p className="m-0 text-sm leading-5 text-[hsl(var(--muted-foreground))] sm:text-sm">
                  Login to access your account
                </p>
              </CardHeader>
              <CardContent className="mt-2 flex flex-col gap-5">
                <div className="space-y-2.5 text-left">
                  <Label
                    className="text-[0.9rem] font-bold text-[hsl(var(--foreground))]"
                    htmlFor={emailId}
                  >
                    Email
                  </Label>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    data-testid="input-email"
                    className={authFieldClassName}
                    value={email}
                    autoComplete="email"
                    onChange={(ev) => setEmail(ev.target.value)}
                  />
                </div>
                <div className="space-y-2.5 text-left">
                  <Label
                    className="text-[0.9rem] font-bold text-[hsl(var(--foreground))]"
                    htmlFor={passwordId}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id={passwordId}
                      name="password"
                      data-testid="input-password"
                      className={cn(authFieldClassName, "pr-10")}
                      value={password}
                      type={showPasswordPlain ? "text" : "password"}
                      autoComplete="current-password"
                      onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordPlain((s) => !s)}
                      className="text-[hsl(var(--foreground))] absolute inset-y-0 right-2.5 my-auto flex size-6 items-center justify-center rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                      aria-label={showPasswordPlain ? "Hide password" : "Show password"}
                      data-testid="toggle-password-visibility"
                    >
                      {showPasswordPlain ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    className="m-0 text-sm text-[hsl(var(--destructive))]"
                    data-testid="auth-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                {succeeded && !error && (
                  <p
                    className="m-0 text-sm text-[hsl(var(--success))]"
                    data-testid="auth-success"
                    role="status"
                  >
                    Signed in
                  </p>
                )}

                <div className="mt-1 flex w-full flex-col gap-4 sm:mt-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    data-testid="auth-submit"
                    type="submit"
                    width="hug"
                    className="h-11 min-w-36 w-full sm:w-auto"
                    disabled={submitting || !canSubmit}
                  >
                    <LogIn className="size-4" aria-hidden />
                    <span>Login</span>
                  </Button>
                  <Link
                    to="#"
                    className="w-full text-center text-sm font-bold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--primary))] underline-offset-2 hover:opacity-90 sm:w-auto sm:text-left"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
