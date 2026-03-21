import { NavLink } from "react-router-dom"
import {
  Map,
  Layers,
  Settings,
  Users,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: "Mapas Temáticos", to: "/admin/mapas", icon: Map },
  { label: "Capas GIS", to: "/admin/capas", icon: Layers },
  { label: "Usuarios", to: "/admin/usuarios", icon: Users },
  { label: "Reportes", to: "/admin/reportes", icon: BarChart3 },
  { label: "Configuración", to: "/config", icon: Settings },
]

function NavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
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
            <p className="text-xs text-muted-foreground">Panel de Administración</p>
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

      <div className="p-2 border-t">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <FileText className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Dashboard</span>}
        </NavLink>
      </div>
    </div>
  )
}
