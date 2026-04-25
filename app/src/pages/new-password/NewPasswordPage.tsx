import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, LogIn, XCircle } from "lucide-react";
import { BrandedAuthShell } from "@/components/common/BrandedAuthShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiBaseUrl } from "@/lib/api";
import { allRulesPass, getPasswordRuleStates, type RuleKey, type RuleStatus } from "@/lib/password-rules";
import { cn } from "@/lib/utils";

const ruleCopy: Record<RuleKey, string> = {
  length: "Minimum 8 characters",
  upper: "At least 1 uppercase letter",
  number: "At least 1 number",
  special: "At least 1 special character",
};

function RuleRow({ status, text }: { status: RuleStatus; text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm" data-testid="password-rule-row">
      {status === "pending" && <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />}
      {status === "pass" && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />}
      {status === "fail" && <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />}
      <span
        className={cn(
          status === "pass" && "text-success",
          status === "fail" && "text-destructive",
          status === "pending" && "text-muted-foreground",
        )}
      >
        {text}
      </span>
    </li>
  );
}

export function NewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const rules = useMemo(() => getPasswordRuleStates(password), [password]);
  const toggleShowConfirm = () => setShowConfirm((v) => !v);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLock.current) return;
    setFormError(null);
    setApiMessage(null);
    if (!allRulesPass(password)) {
      setFormError("Please meet all password requirements.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/new-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword: confirm }),
      });
      if (!res.ok) {
        setApiMessage("Could not update password. Please try again.");
        return;
      }
      setApiMessage("Password updated. Redirecting to login…");
      await navigate("/login");
    } catch {
      setApiMessage("Network error. Please try again.");
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="new-password-page" className="w-full max-w-full">
      <BrandedAuthShell>
        <Card
          className="w-full border border-border/60"
          data-testid="new-password-card"
          style={{ maxWidth: "var(--form-card-width)", padding: "var(--form-inner-padding)" }}
        >
          <CardHeader>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Set your new password</h1>
            <p className="text-sm text-muted-foreground" style={{ marginTop: "0.5rem" }}>
              Ensure that your new password differs from previously used passwords.
            </p>
          </CardHeader>
          <CardContent style={{ marginTop: "var(--form-block-gap)" }}>
            <form
              data-testid="new-password-form"
              onSubmit={onSubmit}
              className="flex flex-col"
              style={{ gap: "var(--form-field-gap)" }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  data-testid="field-password"
                  name="password"
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormError(null);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    data-testid="field-confirm-password"
                    name="confirm"
                    type={showConfirm ? "password" : "text"}
                    value={confirm}
                    autoComplete="new-password"
                    className="pr-10"
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setFormError(null);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground transition hover:text-foreground"
                    onClick={toggleShowConfirm}
                    data-testid="confirm-password-visibility"
                    aria-label={showConfirm ? "Show password" : "Hide password"}
                  >
                    {showConfirm ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
                  </button>
                </div>
              </div>

              <ul
                className="flex flex-col gap-2.5 pl-0"
                data-testid="password-requirements"
                aria-label="Password requirements"
              >
                {(Object.keys(ruleCopy) as RuleKey[]).map((k) => (
                  <RuleRow key={k} status={rules[k]} text={ruleCopy[k]} />
                ))}
              </ul>

              {formError ? (
                <p role="alert" className="text-sm text-destructive" data-testid="form-error">
                  {formError}
                </p>
              ) : null}
              {apiMessage ? (
                <p role="status" className="text-sm text-muted-foreground" data-testid="form-api-message">
                  {apiMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full gap-2 rounded-md text-base"
                data-testid="submit-login"
                disabled={submitting}
              >
                <LogIn className="size-4" />
                Login
              </Button>

              <div className="pt-1 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition hover:underline"
                  data-testid="back-to-login"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Return to the login screen
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </BrandedAuthShell>
    </div>
  );
}
