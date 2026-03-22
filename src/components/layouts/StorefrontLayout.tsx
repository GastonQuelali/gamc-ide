import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useMemo } from "react"
import { Map, User, LogOut, Layers, Home, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useMapaConfig } from "@/hooks/useMapaConfig"
import { MapProvider } from "@/context/MapContext"
import { TOCAccordion } from "@/components/map/TOCAccordion"
import { Button } from "@/components/ui/button"

function extractSlug(pathname: string): string | null {
  const match = pathname.match(/^\/mapa\/(.+)$/)
  return match ? match[1] : null
}

function NormalSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      <nav className="flex-1 p-2 space-y-1">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-sm font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/mapa/bienes-view"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <Map className="h-5 w-5" />
          <span className="text-sm font-medium">Mis Mapas</span>
        </NavLink>

        <NavLink
          to="/capas"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <Layers className="h-5 w-5" />
          <span className="text-sm font-medium">Capas</span>
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">Mi Perfil</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t">
        <div className="mb-3">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  )
}

function MapSidebar({ slug }: { slug: string }) {
  const { mapaConfig, loading, error, loadMapaConfig } = useMapaConfig()

  useEffect(() => {
    if (slug) {
      loadMapaConfig(slug)
    }
  }, [slug, loadMapaConfig])

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <div className="px-3 py-2 border-b bg-muted/30">
          <h2 className="text-sm font-semibold truncate">
            {mapaConfig?.nombre_mapa || "Cargando..."}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mapaConfig?.capas.length || 0} capas
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="p-3">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && mapaConfig?.capas && (
          <div className="h-full overflow-y-auto">
            <TOCAccordion capas={mapaConfig.capas} />
          </div>
        )}
      </div>

      <NormalSidebar />
    </>
  )
}

export function StorefrontLayout() {
  const location = useLocation()
  const slug = useMemo(() => extractSlug(location.pathname), [location.pathname])
  const isMapRoute = !!slug

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <NavLink to="/dashboard" className="block">
            <h1 className="font-bold text-lg">GAMC-IDE</h1>
            <p className="text-xs text-muted-foreground">
              {isMapRoute ? "Visor de Mapas" : "Portal de Consulta"}
            </p>
          </NavLink>
        </div>

        {isMapRoute ? (
          <MapSidebar slug={slug} />
        ) : (
          <NormalSidebar />
        )}
      </aside>

      <main className="flex-1 overflow-hidden">
        <MapProvider>
          <Outlet />
        </MapProvider>
      </main>
    </div>
  )
}
