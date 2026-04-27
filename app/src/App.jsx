import { AuthMarketingSidebar } from '@/components/common/AuthMarketingSidebar'
import { NewPasswordForm } from '@/components/common/NewPasswordForm'

export default function App() {
  return (
    <div className="mx-auto flex min-h-svh w-full min-w-0 max-w-[1440px] flex-col bg-background md:min-h-[min(100svh,898px)] md:flex-row">
      <AuthMarketingSidebar />
      <main
        className="flex min-h-0 min-w-0 flex-1 items-center justify-center bg-background px-6 py-10 md:px-8 md:py-12"
        style={{ minHeight: 'min(100svh, 898px)' }}
      >
        <NewPasswordForm />
      </main>
    </div>
  )
}
