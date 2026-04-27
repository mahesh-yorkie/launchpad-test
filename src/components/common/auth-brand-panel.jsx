import { Waves } from 'lucide-react'
import authBrandBg from '../../assets/auth-brand-bg.png'

function BrandMark() {
  return (
    <div
      className="flex size-14 items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur-[2px]"
      aria-hidden
    >
      <Waves className="size-7 text-white" strokeWidth={2} />
    </div>
  )
}

export function AuthBrandPanel() {
  return (
    <aside
      className="relative flex min-h-[var(--frame-min-height)] w-[var(--brand-panel-width)] shrink-0 flex-col overflow-hidden text-[var(--sidebar-foreground)]"
      data-testid="auth-brand-panel"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${authBrandBg})`,
          backgroundSize: '1440px auto',
          backgroundPosition: 'left center',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[var(--sidebar-overlay)]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[var(--frame-min-height)] flex-col justify-between px-10 pb-8 pt-12">
        <div>
          <BrandMark />
          <p
            className="mt-4 text-lg font-bold uppercase tracking-[0.22em] text-white"
            data-testid="auth-brand-name"
          >
            Current
          </p>
        </div>

        <div className="flex flex-col gap-4 py-10">
          <h2 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
            Track, Schedule, and Optimize Your Pool Services
          </h2>
          <p className="max-w-[420px] text-[15px] leading-6 text-[var(--sidebar-muted)]">
            Effortlessly track every aspect of your services, from client
            appointments to job progress, ensuring that no detail is overlooked.
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--sidebar-muted)]">
          <span>© 2024 Current</span>
          <a className="hover:underline" href="#privacy">
            Privacy
          </a>
        </div>
      </div>
    </aside>
  )
}
