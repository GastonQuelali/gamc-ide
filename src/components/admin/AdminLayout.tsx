import { Outlet, Navigate } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"
import { useAuth } from "@/hooks/useAuth"

export function AdminLayout() {
  const { user } = useAuth()

  if (!user || (user.role !== "admin" && user.role !== "supervisor")) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  )
}
