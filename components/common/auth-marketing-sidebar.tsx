export function AuthMarketingSidebar() {
  return (
    <div className="flex h-full flex-col justify-between px-10 pb-8 pt-10">
      <div className="space-y-auth-stack">
        <div className="flex items-center gap-3">
          <img src="/assets/current-logo-mark.svg" alt="" width={48} height={48} />
          <span className="text-lg font-semibold uppercase tracking-[0.18em] text-sidebar-foreground">Current</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold leading-snug text-sidebar-foreground">
            Track, Schedule, and Optimize Your Pool Services
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-sidebar-foreground/85">
            Effortlessly track every aspect of your services, from client appointments to job progress, ensuring that no
            detail is overlooked.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-sidebar-foreground/80">
        <span>© 2024 Current</span>
        <button type="button" className="underline-offset-4 transition hover:underline">
          Privacy
        </button>
      </div>
    </div>
  );
}
