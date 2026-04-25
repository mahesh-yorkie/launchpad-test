import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { NewPasswordPage } from "./pages/new-password/NewPasswordPage";

function LoginPage() {
  return (
    <div data-testid="login-page" className="min-h-screen bg-background p-10">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-muted-foreground">Authentication placeholder for redirects.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/new-password" replace />} />
      <Route path="/new-password" element={<NewPasswordPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/privacy" element={<div className="p-10">Privacy</div>} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
