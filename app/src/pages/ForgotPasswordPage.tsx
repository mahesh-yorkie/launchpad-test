import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandedAuthSidebar } from "@/components/common/BrandedAuthSidebar";
import { authFieldClassName, isValidEmail } from "@/lib/authForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordPage() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const canSubmit = useMemo(() => isValidEmail(email), [email]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError(null);
    setSucceeded(false);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
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
      data-testid="forgot-password-frame"
    >
      <BrandedAuthSidebar
        footer={
          <div className="mt-6 flex w-full max-w-sm flex-col gap-1 border-t border-[hsl(var(--sidebar-foreground))]/20 pt-6 text-sm text-[hsl(var(--sidebar-foreground))]/80 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2024 Current</span>
            <Link
              to="#"
              className="text-[hsl(var(--sidebar-foreground))] underline decoration-[hsl(var(--sidebar-foreground))]/30 underline-offset-2 hover:decoration-[hsl(var(--sidebar-foreground))]"
              data-testid="forgot-auth-privacy"
            >
              Privacy
            </Link>
          </div>
        }
      >
        <div
          className="flex w-full max-w-sm flex-col gap-6"
          data-testid="forgot-auth-sidebar-hero"
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
        data-testid="forgot-auth-main"
        role="main"
      >
        <div className="w-full max-w-md lg:max-w-lg" data-testid="forgot-auth-right-panel">
          <Card className="w-full max-w-md" data-testid="forgot-auth-card">
            <form onSubmit={onSubmit} className="flex w-full flex-col" noValidate>
              <CardHeader>
                <h1 className="m-0 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-[1.5rem]">
                  Forgot your password
                </h1>
                <p className="m-0 text-sm leading-5 text-[hsl(var(--muted-foreground))] sm:text-sm">
                  Please enter your email address below to initiate the password
                  reset process.
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
                    data-testid="forgot-input-email"
                    className={authFieldClassName}
                    value={email}
                    autoComplete="email"
                    placeholder="alexmora@gmail.com"
                    onChange={(ev) => setEmail(ev.target.value)}
                  />
                </div>

                {error && (
                  <p
                    className="m-0 text-sm text-[hsl(var(--destructive))]"
                    data-testid="forgot-auth-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                {succeeded && !error && (
                  <p
                    className="m-0 text-sm text-[hsl(var(--success))]"
                    data-testid="forgot-auth-success"
                    role="status"
                  >
                    Check your email for reset instructions
                  </p>
                )}

                <Button
                  data-testid="forgot-submit"
                  type="submit"
                  width="full"
                  className="h-11"
                  disabled={submitting || !canSubmit}
                >
                  <Check className="size-4" aria-hidden />
                  <span>Confirm</span>
                </Button>
              </CardContent>
            </form>
            <div className="mt-6 flex w-full items-center justify-center">
              <Link
                to="/login"
                className="text-[hsl(var(--foreground))] inline-flex items-center gap-2 text-sm font-bold no-underline transition-opacity hover:opacity-90 hover:underline"
                data-testid="forgot-return-login"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                <span>Return to the login screen</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
