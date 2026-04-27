import brandMark from '@/assets/brand-mark.svg'
import sidebarTexture from '@/assets/sidebar-ripple.jpg'

export function AuthMarketingSidebar() {
  return (
    <aside className="relative flex min-h-[280px] w-full shrink-0 flex-col overflow-hidden bg-auth-sidebar-canvas md:min-h-[min(100svh,898px)] md:w-[480px]">
      <div
        className="absolute inset-0 bg-auth-sidebar-canvas/90"
        aria-hidden
      />
      <img
        src={sidebarTexture}
        alt=""
        className="absolute inset-0 size-full object-cover mix-blend-soft-light"
      />
      <div className="relative z-10 flex h-full min-h-[inherit] flex-col px-8 pb-8 pt-9 md:min-h-[min(100svh,898px)] md:px-12 md:pb-10 md:pt-11">
        <header className="flex items-center gap-3">
          <img src={brandMark} alt="" width={40} height={40} />
          <span className="text-lg font-bold uppercase tracking-[0.2em] text-sidebar-foreground">
            Current
          </span>
        </header>
        <div className="flex flex-1 flex-col justify-center gap-5 pr-2">
          <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.64px] text-sidebar-foreground">
            Track, Schedule, and Optimize Your Pool Services
          </h1>
          <p className="text-base font-normal leading-6 text-sidebar-muted">
            Effortlessly track every aspect of your services, from client
            appointments to job progress, ensuring that no detail is overlooked.
          </p>
        </div>
        <footer className="mt-auto flex items-center justify-between text-sm leading-5 text-sidebar-foreground/90">
          <span>© 2024 Current</span>
          <button
            type="button"
            className="bg-transparent p-0 font-medium text-inherit hover:text-sidebar-foreground"
          >
            Privacy
          </button>
        </footer>
      </div>
    </aside>
  )
}
