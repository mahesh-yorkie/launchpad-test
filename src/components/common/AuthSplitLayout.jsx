import sidebarHero from '@/assets/sidebar-hero@4x.png'

/**
 * Shared 1440×898 split auth layout: left brand image, right content area.
 */
export function AuthSplitLayout({ children, pageTestId = 'auth-page' }) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col lg:flex-row"
      data-testid={pageTestId}
    >
      <aside
        className="relative flex h-[min(40dvh,280px)] w-full flex-shrink-0 flex-col overflow-hidden bg-foreground lg:h-auto lg:min-h-[var(--layout-min-h)] lg:w-[var(--layout-aside-w)]"
        aria-label="Current product information"
      >
        <img
          src={sidebarHero}
          alt=""
          className="h-full w-full object-cover object-left"
        />
        <span className="sr-only">
          Current. Track, schedule, and optimize your pool services. Copyright 2024
          Current. Privacy.
        </span>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 items-center justify-center bg-background px-6 py-10 lg:min-h-[var(--layout-min-h)]">
        {children}
      </main>
    </div>
  )
}
