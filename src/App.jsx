import { useEffect, useState } from 'react'
import { ForgotPasswordPage } from '@/components/common/ForgotPasswordPage'
import { LoginPage } from '@/components/common/LoginPage'
import { NewPasswordPage } from '@/components/common/NewPasswordPage'
import './App.css'

function getScreenFromHash() {
  if (typeof window === 'undefined') {
    return 'login'
  }
  const h = window.location.hash || '#login'
  if (h === '#new-password' || h.startsWith('#new-password')) {
    return 'new-password'
  }
  if (h === '#forgot-password' || h.startsWith('#forgot-password')) {
    return 'forgot-password'
  }
  return 'login'
}

function App() {
  const [screen, setScreen] = useState(getScreenFromHash)

  useEffect(() => {
    const onHash = () => setScreen(getScreenFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (screen === 'new-password') {
    return <NewPasswordPage />
  }

  if (screen === 'forgot-password') {
    return <ForgotPasswordPage />
  }

  return <LoginPage />
}

export default App
