import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { SignInPage } from "./pages/SignInPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
