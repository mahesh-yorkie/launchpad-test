import { cn } from '@/lib/utils'
import heroLeft from '@/assets/login-hero-left.png'
import logoCurrent from '@/assets/logo-current.svg'

type AuthBrandedColumnProps = {
  className?: string
}

/**
 * Figma: Login — left 480px column, hero image, logo, value prop, footer.
 */
export function AuthBrandedColumn({ className }: AuthBrandedColumnProps) {
  return (
    <div
      className={cn(
        'relative flex w-[var(--login-left-w)] shrink-0 flex-col overflow-hidden bg-black min-h-[var(--login-frame-h)]',
        className,
      )}
    >
      <img
        src={heroLeft}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'var(--auth-hero-scrim)' }}
        aria-hidden
      />

      <div
        className="relative z-10 flex h-full min-h-[var(--login-frame-h)] flex-1 flex-col"
        style={{
          padding: 'var(--login-panel-pt) var(--login-panel-px) var(--login-panel-pb)',
        }}
      >
        <div className="shrink-0">
          <img
            src={logoCurrent}
            width={132}
            height={88}
            alt="Current"
            className="block h-[88px] w-[132px] object-contain object-left"
            data-testid="auth-brand-logo"
          />
        </div>

        <div className="mt-auto flex min-h-0 flex-1 flex-col justify-center gap-4 py-6">
          <h1
            className="m-0 max-w-[20rem] text-2xl font-bold leading-8 text-white [text-shadow:var(--auth-text-shadow-title)]"
            data-testid="auth-brand-title"
          >
            Track, Schedule, and Optimize Your Pool Services
          </h1>
          <p
            className="m-0 max-w-[22rem] text-sm font-normal leading-6 text-white/90 [text-shadow:var(--auth-text-shadow-body)]"
            data-testid="auth-brand-description"
          >
            Effortlessly track every aspect of your services, from client
            appointments to job progress, ensuring that no detail is overlooked.
          </p>
        </div>

        <div className="mt-auto flex shrink-0 items-center justify-between text-xs text-white/85 [text-shadow:var(--auth-text-shadow-footer)]">
          <span>© 2024 Current</span>
          <button
            type="button"
            className="m-0 cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit hover:text-white"
            data-testid="auth-footer-privacy"
          >
            Privacy
          </button>
        </div>
      </div>
    </div>
  )
}
