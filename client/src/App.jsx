import React from "react";
import { Routes, Route } from "react-router-dom";
import { useClientInfo } from "./contexts/ClientInfoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import TwoStepVerification from "./components/TwoStepVerification";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChangePassword from "./components/ChangePassword";
import HandleLoginWithFacebookAndGoogle from "./pages/HandleLoginWithFacebookAndGoogle";

function App() {
  const { token, emailLogin } = useClientInfo();

  return (
    <Routes>
      {/* Trang xử lý việc đăng nhập bằng Google */}
      <Route
        path="/handleLoginWithFacebookAndGoogle"
        element={<HandleLoginWithFacebookAndGoogle />}
      />
      {/* Trang đăng ký, đăng nhập */}
      <Route
        path="/"
        element={
          <ProtectedRoute condition={!token} redirectTo="/home">
            <AuthPage />
          </ProtectedRoute>
        }
      />
      {/* Trang xác minh email */}
      <Route
        path="/verification"
        element={
          <ProtectedRoute condition={!!emailLogin} redirectTo="/">
            <TwoStepVerification />
          </ProtectedRoute>
        }
      />
      {/* Trang đổi mật khẩu*/}
      <Route path="/passwordReset" element={<ChangePassword />} />
      {/* Trang chính sau khi đăng nhập */}
      <Route
        path="/home"
        element={
          <ProtectedRoute condition={!!token} redirectTo="/">
            <HomePage />
          </ProtectedRoute>
        }
      />
      {/* Route fallback cho các trang không hợp lệ */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
