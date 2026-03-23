import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { StorefrontLayout } from "@/components/layouts/StorefrontLayout"
import { AdminLayout } from "@/components/admin/AdminLayout"
import AuthPage from "@/pages/AuthPage"
import AdminAuthPage from "@/pages/admin/AdminAuthPage"
import MapPage from "@/pages/MapPage"
import MapaPage from "@/pages/MapaPage"
import DashboardPage from "@/pages/DashboardPage"
import TramitesPage from "@/pages/TramitesPage"
import CapasPage from "@/pages/CapasPage"
import AdminCapasPage from "@/pages/AdminCapasPage"
import ProfilePage from "@/pages/ProfilePage"
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"
import { AdminMapasPage } from "@/components/admin/AdminMapasPage"
import { AdminCapasConfigPage } from "@/components/admin/AdminCapasConfigPage"
import { AdminUsuariosPage } from "@/components/admin/AdminUsuariosPage"
import { AdminReportesPage } from "@/components/admin/AdminReportesPage"
import { useAuth } from "@/hooks/useAuth"

function AuthRedirect() {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return <AuthPage />
}

function AdminAuthRedirect() {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/admin/dashboard" replace />
  }
  return <AdminAuthPage onBackToStorefront={() => window.location.href = "/"} />
}

function AdminRouteRedirect() {
  const { user, isLoading } = useAuth()
  const token = localStorage.getItem("gamc_token")
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user || !token) {
    return <Navigate to="/admin" replace />
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <AdminLayout />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/admin" element={<AdminAuthRedirect />} />

      <Route element={<StorefrontLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tramites"
          element={
            <ProtectedRoute roles={["admin", "supervisor", "inspector"]}>
              <TramitesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapa/:slug"
          element={
            <ProtectedRoute>
              <MapaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/capas"
          element={
            <ProtectedRoute>
              <CapasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AdminRouteRedirect />}>
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="admin/mapas" element={<AdminMapasPage />} />
        <Route path="admin/mapas/:slug/config" element={<AdminCapasConfigPage />} />
        <Route path="admin/capas" element={<AdminCapasPage />} />
        <Route path="admin/usuarios" element={<AdminUsuariosPage />} />
        <Route path="admin/reportes" element={<AdminReportesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
