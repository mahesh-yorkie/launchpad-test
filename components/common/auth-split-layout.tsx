import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthSplitLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AuthSplitLayout({ sidebar, children, className }: AuthSplitLayoutProps) {
  return (
    <div
      className={cn("auth-min-shell flex w-full bg-auth-shell", className)}
      data-testid="auth-shell"
    >
      <aside
        className="auth-sidebar-surface relative hidden w-auth-sidebar shrink-0 overflow-hidden text-sidebar-foreground lg:flex lg:flex-col"
        aria-label="Product marketing"
      >
        {sidebar}
      </aside>
      <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">{children}</main>
    </div>
  );
}
