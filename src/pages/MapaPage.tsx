import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { useMapaConfig } from "@/hooks/useMapaConfig"
import { MapCanvas } from "@/components/map/MapCanvas"
import { Button } from "@/components/ui/button"

export default function MapaPage() {
  const params = useParams()
  const navigate = useNavigate()
  const slug = params.slug || ""
  const { mapaConfig, loading, error, loadMapaConfig } = useMapaConfig()

  useEffect(() => {
    if (slug) {
      loadMapaConfig(slug)
    }
  }, [slug, loadMapaConfig])

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Selecciona un mapa</h2>
        <p className="text-muted-foreground mb-4">
          Elige un mapa temático del panel izquierdo para comenzar.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Ir al Dashboard
        </Button>
      </div>
    )
  }

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Mapa no encontrado</h2>
        <p className="text-muted-foreground mb-2">
          El mapa <code className="bg-muted px-2 py-1 rounded">{slug}</code> no existe o no está disponible.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona un mapa del panel izquierdo.
        </p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Ir al Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold">
            {mapaConfig?.nombre_mapa || "Cargando..."}
          </h1>
          <span className="text-xs text-muted-foreground ml-auto">
            {mapaConfig?.capas.length || 0} capas
          </span>
        </div>
      </header>

      <div className="flex-1 relative">
        <MapCanvas
          config={mapaConfig}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
