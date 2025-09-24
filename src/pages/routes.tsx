import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/agent/pages/DashboardPage";
import AppLayout from "@/layouts/AppLayout";
import AnomalyPage from "@/features/anomaly/pages/AnomalyPage";
import NotAvailablePage from "@/features/notavailable/pages/NotAvailablePage";

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

      {/* Anomaly Detection */}
      <Route
        path="/anomaly"
        element={
          <AppLayout>
            <AnomalyPage />
          </AppLayout>
        }
      />

      {/* Not Available page */}
      <Route
        path="/notavailable"
        element={
          <AppLayout>
            <NotAvailablePage />
          </AppLayout>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}