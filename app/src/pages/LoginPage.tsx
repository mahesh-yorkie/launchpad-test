import { useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, LogIn, XCircle, Eye, EyeOff } from "lucide-react";
import { AuthMarketingSidebar } from "@/components/common/auth-marketing-sidebar";
import { AuthSplitLayout } from "@/components/common/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type RuleKey = "length" | "upper" | "number" | "special";

const ruleCopy: Record<RuleKey, string> = {
  length: "Minimum 8 characters",
  upper: "At least 1 uppercase letter",
  number: "At least 1 number",
  special: "At least 1 special character",
};

function evaluateRules(password: string): Record<RuleKey, boolean> {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

const ruleOrder: RuleKey[] = ["length", "upper", "number", "special"];

export function LoginPage() {
  const passwordId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitLock = useRef(false);

  const rules = useMemo(() => evaluateRules(password), [password]);
  const allRulesMet = ruleOrder.every((key) => rules[key]);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = allRulesMet && passwordsMatch && status !== "loading";

  function resetFeedbackAfterEdit() {
    setStatus((prev) => (prev === "error" || prev === "success" ? "idle" : prev));
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit || submitLock.current) return;
    submitLock.current = true;
    setStatus("loading");
    setErrorMessage(null);
    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
    try {
      const response = await fetch(`${apiBase}/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const raw = await response.text();
      let payload: { message?: string } = {};
      try {
        payload = raw ? (JSON.parse(raw) as { message?: string }) : {};
      } catch {
        throw new Error("Malformed response");
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to update password");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      submitLock.current = false;
    }
  }

  return (
    <AuthSplitLayout sidebar={<AuthMarketingSidebar />}>
      <Card className="w-full max-w-auth-card border-auth-card-border p-auth-card-pad shadow-auth">
        <CardHeader className="space-y-3 p-0">
          <h1 className="text-auth-title font-semibold tracking-tight text-foreground">Set your new password</h1>
          <CardDescription>
            Ensure that your new password differs from previously used passwords.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 space-y-auth-stack p-0">
          <form className="space-y-auth-stack" onSubmit={handleSubmit}>
            {status === "error" ? (
              <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}
            {status === "success" ? (
              <div
                role="status"
                className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
              >
                Password updated. You can return to the login screen.
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor={passwordId}>Password</Label>
              <Input
                id={passwordId}
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  resetFeedbackAfterEdit();
                }}
                data-testid="password-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={confirmId}>Confirm New Password</Label>
              <div className="relative">
                <Input
                  id={confirmId}
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    resetFeedbackAfterEdit();
                  }}
                  className="pr-11"
                  data-testid="confirm-password-input"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 inline-flex items-center rounded-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <ul className="space-y-auth-rule-gap" aria-live="polite">
              {ruleOrder.map((key) => {
                const met = rules[key];
                return (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    {met ? (
                      <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
                    ) : (
                      <XCircle className="size-4 shrink-0 text-destructive" aria-hidden />
                    )}
                    <span className={cn(met ? "text-success" : "text-destructive")}>{ruleCopy[key]}</span>
                  </li>
                );
              })}
            </ul>
            <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit} data-testid="submit-password">
              <LogIn className="size-4" />
              Login
            </Button>
          </form>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary"
            data-testid="return-to-login"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Return to the login screen
          </Link>
        </CardContent>
      </Card>
    </AuthSplitLayout>
  );
}
