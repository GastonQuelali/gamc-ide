import { NavLink, useNavigate } from "react-router-dom"
import {
  Map,
  Layers,
  Users,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: BarChart3 },
  { label: "Mapas Temáticos", to: "/admin/mapas", icon: Map },
  { label: "Capas GIS", to: "/admin/capas", icon: Layers },
  { label: "Usuarios", to: "/admin/usuarios", icon: Users },
  { label: "Reportes", to: "/admin/reportes", icon: FileText },
]

function NavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/admin/dashboard"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`
      }
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </NavLink>
  )
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/admin")
  }

  return (
    <div
      className={`flex flex-col h-screen bg-card border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg">GAMC-IDE</h1>
            <p className="text-xs text-muted-foreground">Backoffice</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-2 border-t space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <ArrowLeft className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Ir al Storefront</span>}
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 ${
            collapsed ? "px-2" : "px-3"
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium ml-3">Cerrar Sesión</span>}
        </Button>

        {user && !collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
