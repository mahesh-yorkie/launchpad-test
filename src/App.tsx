import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/const/routes'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { NewPasswordPage } from '@/pages/auth/NewPasswordPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={ROUTES.newPassword} />} />
      <Route path={ROUTES.newPassword} element={<NewPasswordPage />} />
      <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
    </Routes>
  )
}
