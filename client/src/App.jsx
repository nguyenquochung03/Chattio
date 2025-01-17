import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useClientInfo } from "./contexts/ClientInfoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import { HomeProvider } from "./contexts/HomeContext";
import TwoStepVerification from "./components/TwoStepVerification";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChangePassword from "./components/ChangePassword";
import HandleLoginWithFacebookAndGoogle from "./pages/HandleLoginWithFacebookAndGoogle";
import Messages from "./components/sections/Messages/Messages";
import People from "./components/sections/People/People";
import FriendRequests from "./components/sections/FriendRequests/FriendRequests";
import Settings from "./components/sections/Settings/Settings";

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
            <HomeProvider>
              <HomePage />
            </HomeProvider>
          </ProtectedRoute>
        }
      >
        {/* Nested routes cho HomePage */}
        <Route index element={<Navigate to="/home/messages" />} />
        <Route path="messages" element={<Messages />} />
        <Route path="people" element={<People />} />
        <Route path="friendRequests" element={<FriendRequests />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      {/* Route fallback cho các trang không hợp lệ */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
