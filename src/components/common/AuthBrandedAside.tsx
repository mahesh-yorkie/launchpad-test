import { Waves } from 'lucide-react'

import { AUTH_BRANDING_COPY } from '@/const/auth-branding'

import brandPanel from '@/assets/new-password-brand-panel.png'

export function AuthBrandedAside() {
  return (
    <aside
      className="relative order-2 flex min-h-[320px] flex-col justify-between gap-10 overflow-hidden px-6 py-8 text-white md:min-h-[420px] md:px-8 md:py-10 lg:order-1 lg:min-h-0 lg:px-10 lg:py-12"
      aria-label="Brand"
    >
      <img
        src={brandPanel}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/35" aria-hidden="true" />
      <div className="relative z-10 flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 md:size-12">
          <Waves aria-hidden className="size-6 text-white" strokeWidth={1.75} />
        </span>
        <span className="text-lg font-semibold tracking-[0.12em] md:text-xl">
          {AUTH_BRANDING_COPY.brandName}
        </span>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 md:gap-5">
        <h1 className="text-balance text-2xl font-semibold leading-tight md:text-3xl lg:text-[32px] lg:leading-[40px]">
          {AUTH_BRANDING_COPY.marketingHeading}
        </h1>
        <p className="max-w-[420px] text-pretty text-sm leading-relaxed text-white/90 md:text-base lg:text-[16px] lg:leading-[26px]">
          {AUTH_BRANDING_COPY.marketingBody}
        </p>
      </div>
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80 md:text-sm">
        <span>{AUTH_BRANDING_COPY.copyright}</span>
        <a
          href="#privacy-notice"
          className="inline-flex min-h-[44px] items-center rounded-sm px-2 underline-offset-4 hover:underline sm:min-h-0 sm:px-0"
        >
          {AUTH_BRANDING_COPY.privacy}
        </a>
      </footer>
      <div id="privacy-notice" className="sr-only" tabIndex={-1}>
        Privacy details are not part of this prototype; this anchor keeps the
        control keyboard-accessible without leaving the screen.
      </div>
    </aside>
  )
}
