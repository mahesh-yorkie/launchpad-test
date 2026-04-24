import currentLogo from '../../assets/current-logo.svg'
import { AuthSidebarBackdrop } from './auth-split-layout.jsx'

export function AuthMarketingSidebar() {
  return (
    <AuthSidebarBackdrop>
      <div className="flex flex-1 flex-col px-login-brand-x py-login-brand-y">
        <header className="flex items-center gap-3">
          <img src={currentLogo} width={48} height={48} alt="" />
          <span className="text-lg font-bold tracking-[0.2em] text-auth-sidebar-foreground">
            CURRENT
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-4 pr-4">
          <h1 className="max-w-[22rem] text-login-brand-head font-semibold text-auth-sidebar-foreground">
            Track, Schedule, and Optimize Your Pool Services
          </h1>
          <p className="max-w-[22rem] text-base font-medium leading-6 text-auth-sidebar-muted">
            Effortlessly track every aspect of your services, from client
            appointments to job progress, ensuring that no detail is overlooked.
          </p>
        </div>

        <footer className="mt-auto flex items-center justify-between text-sm text-auth-sidebar-muted">
          <span>© 2024 Current</span>
          <a
            className="font-medium text-auth-sidebar-foreground hover:text-auth-sidebar-foreground"
            href="#privacy"
          >
            Privacy
          </a>
        </footer>
      </div>
    </AuthSidebarBackdrop>
  )
}
