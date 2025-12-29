import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/agent/pages/DashboardPage";
import AppLayout from "@/layouts/AppLayout";
import BlankPage from "@/features/blank/pages/BlankPage";
import InnovationsPage from "@/features/blank/pages/InnovationsPage";
import DetailPage from "@/features/blank/pages/DetailPage";

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

      {/* Blank page */}
      <Route
        path="/blank"
        element={
          <AppLayout>
            <BlankPage />
          </AppLayout>
        }
      />

      {/* Innovations page */}
      <Route
        path="/innovations"
        element={
          <AppLayout>
            <InnovationsPage />
          </AppLayout>
        }
      />

      {/* Detail page */}
      <Route
        path="/detail/:id"
        element={
          <AppLayout>
            <DetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/detail"
        element={
          <AppLayout>
            <DetailPage />
          </AppLayout>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}