import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Map, LayoutDashboard, Settings, LogOut, Menu, X, ChevronLeft, Layers, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

interface SidebarProps {
  children: React.ReactNode
}

const navItems = [
  { path: "/dashboard", label: "Indicadores", icon: LayoutDashboard },
  { path: "/tramites", label: "Trámites", icon: FileText },
  { path: "/map", label: "Mapa", icon: Map },
  { path: "/capas", label: "Capas", icon: Layers },
  { path: "/admin/capas", label: "Admin Capas", icon: Shield },
  { path: "/config", label: "Configuración", icon: Settings },
]

export default function Sidebar({ children }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300",
          isOpen ? "w-64" : "w-16",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className={cn("flex items-center gap-3", !isOpen && "justify-center w-full")}>
            <div className="p-2 bg-primary rounded-lg flex-shrink-0">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            {isOpen && <span className="font-bold text-lg">GAMC-IDE</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !isOpen && "justify-center"
                )}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-2 border-t space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn("w-full", isOpen ? "justify-start px-3" : "justify-center")}
            title={!isOpen ? (theme === "dark" ? "Modo claro" : "Modo oscuro") : undefined}
          >
            {theme === "dark" ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5">☀️</span>
                {isOpen && <span>Modo Claro</span>}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5">🌙</span>
                {isOpen && <span>Modo Oscuro</span>}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn("w-full text-red-500 hover:text-red-600 hover:bg-red-50", isOpen ? "justify-start px-3" : "justify-center")}
            title={!isOpen ? "Cerrar sesión" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>

        {isOpen && user && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className={cn("flex-1 transition-all duration-300", isOpen ? "lg:ml-64" : "lg:ml-16")}>
        <div className="lg:hidden p-4 border-b bg-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded">
              <Map className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">GAMC-IDE</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </main>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  )
}
