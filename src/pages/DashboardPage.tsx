import { useLocation } from 'react-router-dom'

export function DashboardPage() {
  const location = useLocation()
  const state = location.state as { email?: string } | null
  const email = state?.email

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-3 bg-background px-4 py-10 text-center text-foreground">
      <h1 className="text-2xl font-semibold tracking-tight">Signed in</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {email
          ? `You are signed in as ${email}. This is a prototype home screen.`
          : 'You are signed in. This is a prototype home screen.'}
      </p>
    </main>
  )
}
