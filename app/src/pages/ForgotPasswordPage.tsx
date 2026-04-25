import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthMarketingSidebar } from "@/components/common/auth-marketing-sidebar";
import { AuthSplitLayout } from "@/components/common/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitLock = useRef(false);

  const trimmedEmail = email.trim();
  const emailValid = emailPattern.test(trimmedEmail);
  const canSubmit = emailValid && status !== "loading";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Current — Forgot password";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  function resetFeedbackAfterEdit() {
    setStatus((prev) => (prev === "error" || prev === "success" ? "idle" : prev));
    setErrorMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitLock.current) return;
    submitLock.current = true;
    setStatus("loading");
    setErrorMessage(null);
    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
    try {
      const response = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const raw = await response.text();
      let payload: { message?: string } = {};
      try {
        payload = raw ? (JSON.parse(raw) as { message?: string }) : {};
      } catch {
        throw new Error("Malformed response");
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to send reset email");
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
          <h1 className="text-auth-title font-semibold tracking-tight text-foreground">Forgot your password</h1>
          <CardDescription>
            Please enter your email address below to initiate the password reset process.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 space-y-auth-stack p-0">
          <form className="space-y-auth-stack" onSubmit={handleSubmit}>
            {status === "error" ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {errorMessage}
              </div>
            ) : null}
            {status === "success" ? (
              <div
                role="status"
                className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
              >
                If an account exists for this email, you will receive reset instructions shortly.
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="alexmora@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetFeedbackAfterEdit();
                }}
                data-testid="forgot-email-input"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit} data-testid="forgot-submit">
              <CheckCircle2 className="size-4" aria-hidden />
              Confirm
            </Button>
          </form>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary"
            data-testid="forgot-return-to-login"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Return to the login screen
          </Link>
        </CardContent>
      </Card>
    </AuthSplitLayout>
  );
}
