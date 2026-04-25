import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import brandMark from "@/assets/brand-mark.svg";
import ripples from "@/assets/sidebar-ripples.svg";

type BrandedAuthSidebarProps = {
  className?: string;
  children?: ReactNode;
  footer: ReactNode;
};

export function BrandedAuthSidebar({
  className,
  children,
  footer,
}: BrandedAuthSidebarProps) {
  return (
    <aside
      className={cn(
        "relative flex w-full min-w-0 flex-1 flex-col justify-between overflow-hidden",
        "lg:w-[480px] lg:min-w-[400px] lg:max-w-[480px] lg:shrink-0",
        className,
      )}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `hsl(var(--sidebar-overlay)) center/cover no-repeat, url(${ripples}) center/cover no-repeat`,
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--sidebar))]/0 via-[hsl(var(--sidebar))]/20 to-[hsl(var(--sidebar))]/50" />
      <div className="relative z-0 flex h-full w-full min-h-[40rem] flex-1 flex-col p-8 pb-6 pr-6 pt-8 lg:px-10 lg:pb-8 lg:pt-10">
        <header className="flex flex-col items-start gap-3">
          <img
            src={brandMark}
            width={64}
            height={64}
            className="size-14"
            alt=""
            data-testid="auth-brand-icon"
          />
          <p
            className="text-sm font-bold uppercase tracking-[0.16em] text-[hsl(var(--sidebar-foreground))]"
            data-testid="auth-brand-name"
          >
            Current
          </p>
        </header>
        <div className="mt-12 flex-1 pr-0 lg:mt-16">
          {children}
        </div>
        {footer}
      </div>
    </aside>
  );
}
