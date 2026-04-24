import { useEffect, useState } from 'react'
import { ForgotPassword } from './pages/ForgotPassword.jsx'
import { Login } from './pages/Login.jsx'

function readAuthRoute() {
  return window.location.hash === '#/forgot-password' ? 'forgot' : 'login'
}

function App() {
  const [route, setRoute] = useState(readAuthRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readAuthRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route === 'forgot' ? <ForgotPassword /> : <Login />
}

export default App
