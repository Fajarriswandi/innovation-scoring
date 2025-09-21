import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/agent/pages/DashboardPage";
import AppLayout from "@/layouts/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* tanpa layout */}
      <Route path="/" element={<LoginPage />} />

      {/* dengan AppLayout */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}