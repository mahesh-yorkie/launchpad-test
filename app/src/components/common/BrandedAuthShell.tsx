import * as React from "react";
import { cn } from "@/lib/utils";

type BrandedAuthShellProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Two-column auth layout from Figma “New Password” (1440×898): 30% branded hero, 70% form column.
 */
export function BrandedAuthShell({ children, className }: BrandedAuthShellProps) {
  return (
    <div
      data-testid="branded-auth-shell"
      className={cn(
        "mx-auto flex w-full min-h-screen max-w-[var(--auth-content-max)] flex-col md:flex-row",
        className,
      )}
    >
      <aside
        className="relative flex min-h-[220px] w-full shrink-0 flex-col overflow-hidden bg-brand-nav text-sidebar-fg sm:min-h-[min(100vh,898px)] md:min-h-screen md:w-[30%] md:min-w-[var(--auth-left-width)] md:max-w-md"
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/assets/auth-hero-pool.svg')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/5 to-primary/25" aria-hidden />
        <div className="absolute inset-0 bg-black/25" aria-hidden />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pb-6 pt-8 md:px-10 md:pb-8 md:pt-10">
          <img
            src="/assets/logo-current.svg"
            width={180}
            height={64}
            alt="Current"
            className="h-auto w-44"
          />
          <div className="mt-12 flex-1 pr-2">
            <h2
              className="text-3xl font-bold leading-tight text-sidebar-fg"
              style={{ maxWidth: "20rem" }}
            >
              Track, Schedule, and Optimize Your Pool Services
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sidebar-fg/90">
              Effortlessly track every aspect of your services, from client appointments to job progress,
              ensuring that no detail is overlooked.
            </p>
          </div>
          <div className="mt-auto flex items-center justify-between text-xs text-sidebar-fg/85">
            <span>© 2024 Current</span>
            <a href="/privacy" className="font-medium text-sidebar-fg hover:underline" data-testid="auth-privacy-link">
              Privacy
            </a>
          </div>
        </div>
      </aside>
      <div
        className="flex min-h-0 min-w-0 flex-1 items-center justify-center bg-background px-6 py-10"
        data-testid="branded-auth-main"
      >
        {children}
      </div>
    </div>
  );
}
