import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import leftHeroImage from "@/assets/8c047b60d1d5297370251e49bc494cb7c9aaaa6f.png";
import currentLogo from "@/assets/2281-157.svg";

type AuthSplitLayoutProps = {
  children: ReactNode;
  className?: string;
};

/**
 * 1440×898 mock: left 480 (image + copy), right flex area #ecf2f6 (Figma 2281:147).
 */
export function AuthSplitLayout({ children, className }: AuthSplitLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-[898px] w-full min-w-0 flex-col bg-background md:h-[898px] md:max-h-[898px] md:min-h-[898px] md:flex-row",
        className,
      )}
    >
      <aside
        className="relative flex w-full shrink-0 flex-col md:h-[898px] md:w-[480px]"
        data-testid="auth-hero"
      >
        <img
          src={leftHeroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={480}
          height={898}
        />
        <div className="relative z-[1] flex h-full min-h-[520px] flex-1 flex-col md:min-h-0">
          <div
            className="flex pl-10 pr-4 pt-5"
            style={{ paddingTop: 20, paddingLeft: 40, paddingRight: 16 }}
          >
            <div className="w-[129px]">
              <img
                src={currentLogo}
                alt="Current"
                className="h-[101px] w-[129px] object-contain"
                width={129}
                height={101}
                data-testid="auth-brand-mark"
              />
            </div>
          </div>
          <div
            className="flex max-w-[299px] flex-1 flex-col justify-center pl-10 pr-4"
            style={{ marginTop: 24 }}
          >
            <div className="flex flex-col" style={{ gap: 40 }}>
              <h2
                className="whitespace-pre-line text-[30px] font-medium leading-[1.2] text-auth-sidebar-fg"
                data-testid="auth-hero-heading"
              >{`Track, Schedule,
and Optimize
Your Pool Services`}</h2>
              <p
                className="text-base font-normal leading-6 text-auth-sidebar-fg/95"
                data-testid="auth-hero-sub"
              >
                Effortlessly track every aspect of your services, from client
                appointments to job progress, ensuring that no detail is
                overlooked.
              </p>
            </div>
          </div>
          <footer
            className="relative z-[1] box-border w-full"
            style={{ height: 50, padding: "14px 20px" }}
            data-testid="auth-hero-footer"
          >
            <div className="flex h-full items-center justify-between text-sm font-normal text-auth-sidebar-fg">
              <span>© 2024 Current</span>
              <a
                href="#privacy"
                className="hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Privacy
              </a>
            </div>
          </footer>
        </div>
      </aside>
      <div
        className="flex min-h-0 flex-1 flex-col items-center justify-center bg-panel px-4 py-8 md:min-h-[898px] md:w-[960px] md:shrink-0 md:py-0"
        data-testid="auth-form-area"
      >
        {children}
      </div>
    </div>
  );
}
