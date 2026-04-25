import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { AuthMarketingSidebar } from "@/components/common/auth-marketing-sidebar";
import { AuthSplitLayout } from "@/components/common/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInPage() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitLock = useRef(false);

  const trimmedEmail = email.trim();
  const emailValid = emailPattern.test(trimmedEmail);
  const canSubmit = emailValid && password.length > 0 && status !== "loading";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Current — Login";
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
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const raw = await response.text();
      let payload: { message?: string } = {};
      try {
        payload = raw ? (JSON.parse(raw) as { message?: string }) : {};
      } catch {
        throw new Error("Malformed response");
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to sign in");
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
          <h1 className="text-auth-title font-semibold tracking-tight text-foreground">Login</h1>
          <CardDescription>Login to access your account</CardDescription>
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
                Signed in successfully.
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                placeholder="alexmora@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetFeedbackAfterEdit();
                }}
                data-testid="sign-in-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={passwordId}>Password</Label>
              <div className="relative">
                <Input
                  id={passwordId}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    resetFeedbackAfterEdit();
                  }}
                  className="pr-11"
                  data-testid="sign-in-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 inline-flex items-center rounded-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit} data-testid="sign-in-submit">
                <LogIn className="size-4" aria-hidden />
                Login
              </Button>
              <Link
                to="/forgot-password"
                className="text-center text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/90 hover:underline sm:text-left"
                data-testid="sign-in-forgot-password"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthSplitLayout>
  );
}
