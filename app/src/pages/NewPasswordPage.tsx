import { ArrowLeft, CheckCircle2, Eye, EyeOff, LogIn, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AuthSplitLayout } from "@/components/common/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function checkPassword(p: string) {
  return {
    minLen: p.length >= 8,
    upper: /[A-Z]/.test(p),
    number: /\d/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };
}

const RULES: { key: keyof ReturnType<typeof checkPassword>; label: string }[] = [
  { key: "minLen", label: "Minimum 8 characters" },
  { key: "upper", label: "At least 1 uppercase letter" },
  { key: "number", label: "At least 1 number" },
  { key: "special", label: "At least 1 special character" },
];

export function NewPasswordPage() {
  const [password, setPassword] = useState("Abcdefgh");
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const analysis = useMemo(() => checkPassword(password), [password]);

  return (
    <div
      className="flex min-h-screen w-full justify-center bg-background"
      data-testid="new-password-page"
    >
      <div className="w-full max-w-[1440px] overflow-hidden">
        <AuthSplitLayout>
          <div
            className="box-border flex w-full max-w-[630px] flex-col bg-card text-card-foreground shadow-card"
            style={{
              borderRadius: 4,
              paddingLeft: 100,
              paddingRight: 100,
              paddingTop: 70,
              paddingBottom: 70,
              gap: 40,
            }}
            data-testid="new-password-card"
          >
            <div
              className="flex w-full max-w-[430px] flex-col"
              style={{ gap: 50 }}
            >
              <div
                className="flex w-full max-w-[430px] flex-col"
                style={{ gap: 4, minHeight: 98 }}
              >
                <h1
                  className="text-2xl font-bold leading-8 text-foreground"
                  data-testid="new-password-title"
                >
                  Set your new password
                </h1>
                <p
                  className="text-base font-normal leading-6 text-muted-foreground"
                  data-testid="new-password-subtitle"
                >
                  Ensure that your new password differs from previously used
                  passwords.
                </p>
              </div>
              <div
                className="mx-auto flex w-full max-w-[350px] flex-col"
                style={{ gap: 30 }}
              >
                <form
                  className="flex flex-col"
                  style={{ gap: 30 }}
                  onSubmit={(e) => e.preventDefault()}
                  noValidate
                  data-testid="new-password-form"
                >
                  <div
                    className="flex flex-col"
                    style={{ gap: 8 }}
                    data-testid="field-password"
                  >
                    <Label
                      htmlFor="new-password"
                      className="text-foreground/90"
                    >
                      Password
                    </Label>
                    <Input
                      id="new-password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="h-10 border-border"
                      data-testid="new-password-input"
                      aria-describedby="password-rules"
                    />
                  </div>
                  <div
                    className="flex flex-col"
                    style={{ gap: 8 }}
                    data-testid="field-confirm"
                  >
                    <Label
                      htmlFor="confirm-password"
                      className="text-foreground/90"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirm"
                        type={showConfirm ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password"
                        className="h-10 border-border pr-10"
                        data-testid="confirm-password-input"
                        placeholder=""
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                        data-testid="toggle-confirm-visibility"
                      >
                        {showConfirm ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <ul
                    className="flex list-none flex-col p-0"
                    style={{ gap: 4 }}
                    id="password-rules"
                    data-testid="password-rules"
                  >
                    {RULES.map((rule) => {
                      const ok = analysis[rule.key];
                      return (
                        <li
                          key={rule.key}
                          className="flex items-center gap-2 text-sm"
                          data-testid={`rule-${rule.key}`}
                          data-state={ok ? "pass" : "fail"}
                        >
                          {ok ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                          )}
                          <span
                            className={cn(
                              "leading-5",
                              ok ? "text-foreground" : "text-foreground/80",
                            )}
                          >
                            {rule.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <Button
                    type="submit"
                    size="auth"
                    className="h-10 gap-2 rounded-md font-medium"
                    data-testid="new-password-submit"
                  >
                    <LogIn className="h-4 w-4 text-primary-foreground" />
                    Login
                  </Button>
                </form>
              </div>
            </div>
            <div
              className="flex w-full max-w-[430px] flex-col"
              style={{ gap: 10 }}
            >
              <div className="flex min-h-[22px] items-center gap-2.5 text-sm text-foreground/90">
                <ArrowLeft
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <Link
                  to="/"
                  className="leading-[22px] hover:underline"
                  data-testid="return-to-login"
                >
                  Return to the login screen
                </Link>
              </div>
              <p
                className="text-sm leading-4 text-muted-foreground"
                data-testid="create-account-prompt"
              >
                Don’t have account?{" "}
                <a
                  href="#create"
                  className="text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Create new account
                </a>
              </p>
            </div>
          </div>
        </AuthSplitLayout>
      </div>
    </div>
  );
}
