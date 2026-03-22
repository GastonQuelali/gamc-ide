import { Outlet } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  )
}
