import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, CircleX, LogIn, Eye, EyeOff, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandedAuthSidebar } from "@/components/common/BrandedAuthSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function getPasswordRuleState(password: string) {
  return {
    min8: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password) && /[^\s]/.test(password),
  } as const;
}

type RuleKey = keyof ReturnType<typeof getPasswordRuleState>;

const RULES: { key: RuleKey; label: string }[] = [
  { key: "min8", label: "Minimum 8 characters" },
  { key: "upper", label: "At least 1 uppercase letter" },
  { key: "number", label: "At least 1 number" },
  { key: "special", label: "At least 1 special character" },
];

export function LoginPage() {
  const passwordId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState("AbcdefgH");
  const [confirm, setConfirm] = useState("AbcdefgH");
  const [showConfirmPlain, setShowConfirmPlain] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const rules = useMemo(() => getPasswordRuleState(password), [password]);
  const canSubmit = useMemo(() => {
    const p = getPasswordRuleState(password);
    return p.min8 && p.upper && p.number && p.special && password === confirm;
  }, [password, confirm]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ password: true, confirm: true });
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
        body: JSON.stringify({ password, confirmPassword: confirm }),
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
                  Set your new password
                </h1>
                <p className="m-0 text-sm leading-5 text-[hsl(var(--muted-foreground))] sm:text-sm">
                  Ensure that your new password differs from previously used
                  passwords.
                </p>
              </CardHeader>
              <CardContent className="mt-2 flex flex-col gap-5">
                <div className="space-y-2.5 text-left">
                  <Label className="text-[0.9rem] font-medium" htmlFor={passwordId}>
                    Password
                  </Label>
                  <Input
                    id={passwordId}
                    name="password"
                    data-testid="input-password"
                    className="h-11"
                    value={password}
                    type="password"
                    autoComplete="new-password"
                    onChange={(ev) => {
                      setPassword(ev.target.value);
                    }}
                    onFocus={() => setTouched((t) => ({ ...t, password: true }))}
                    aria-describedby={`${passwordId}-rules`}
                    aria-invalid={
                      touched.password &&
                      !getPasswordRuleState(password).min8
                        ? true
                        : undefined
                    }
                  />
                </div>
                <div className="space-y-2.5 text-left">
                  <Label className="text-[0.9rem] font-medium" htmlFor={confirmId}>
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id={confirmId}
                      name="confirm"
                      data-testid="input-confirm"
                      className="h-11 pr-10"
                      value={confirm}
                      type={showConfirmPlain ? "text" : "password"}
                      autoComplete="new-password"
                      onChange={(ev) => {
                        setConfirm(ev.target.value);
                      }}
                      onFocus={() => setTouched((t) => ({ ...t, confirm: true }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPlain((s) => !s)}
                      className="text-[hsl(var(--muted-foreground))] absolute inset-y-0 right-2.5 my-auto flex size-6 items-center justify-center rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                      aria-label={showConfirmPlain ? "Hide password" : "Show password"}
                      data-testid="toggle-confirm-visibility"
                    >
                      {showConfirmPlain ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <ul
                  id={`${passwordId}-rules`}
                  className="m-0 list-none space-y-2.5 p-0"
                  aria-live="polite"
                  data-testid="password-rules"
                >
                  {RULES.map((rule) => {
                    const ok = rules[rule.key];
                    return (
                      <li
                        key={rule.key}
                        className="flex items-start gap-2.5 text-left text-sm leading-5"
                      >
                        {ok ? (
                          <span className="text-[hsl(var(--success))] mt-0.5 flex size-4 shrink-0 items-center justify-center" aria-label="Satisfied">
                            <CircleCheck className="size-4" />
                          </span>
                        ) : (
                          <span
                            className="text-[hsl(var(--destructive))] mt-0.5 flex size-4 shrink-0 items-center justify-center"
                            aria-label="Not satisfied"
                          >
                            <CircleX className="size-4" />
                          </span>
                        )}
                        <span
                          className={cn(
                            ok
                              ? "text-[hsl(var(--success))] font-medium"
                              : "text-[hsl(var(--destructive))] font-medium",
                          )}
                        >
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>

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
                    Sign-in updated
                  </p>
                )}

                <Button
                  data-testid="auth-submit"
                  className="mt-1 h-11 w-full"
                  type="submit"
                  disabled={submitting || !canSubmit}
                >
                  <LogIn className="size-4" aria-hidden />
                  <span>Login</span>
                </Button>
              </CardContent>
            </form>
            <div className="mt-8 flex w-full items-center justify-center sm:mt-8">
              <Link
                to="#"
                className="text-[hsl(var(--muted-foreground))] group inline-flex items-center gap-2 text-sm no-underline hover:underline"
                data-testid="return-to-login"
              >
                <ArrowLeft className="size-4" aria-hidden />
                <span>Return to the login screen</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
