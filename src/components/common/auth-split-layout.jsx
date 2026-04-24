import { cn } from '../../lib/utils.js'

export function AuthSplitLayout({ sidebar, children, className }) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-auth-frame w-full max-w-auth-frame flex-col overflow-hidden bg-background lg:flex-row',
        className,
      )}
    >
      <aside className="relative w-full shrink-0 lg:flex lg:w-auth-sidebar lg:flex-col lg:min-h-0">
        {sidebar}
      </aside>
      <main className="relative flex min-h-0 min-h-[60vh] flex-1 flex-col lg:min-h-auth-frame">
        {children}
      </main>
    </div>
  )
}

export function AuthSidebarBackdrop({ className, children }) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] h-full w-full flex-col bg-auth-sidebar text-auth-sidebar-foreground lg:min-h-auth-frame',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(120% 80% at 20% 20%, hsl(199 89% 48% / 0.35), transparent 55%),
            radial-gradient(100% 60% at 80% 0%, hsl(173 58% 39% / 0.25), transparent 50%),
            repeating-linear-gradient(
              125deg,
              hsl(222 47% 18%) 0px,
              hsl(215 45% 22%) 2px,
              hsl(222 47% 14%) 6px
            )
          `,
        }}
      />
      <div className="relative z-[1] flex h-full flex-col">{children}</div>
    </div>
  )
}
