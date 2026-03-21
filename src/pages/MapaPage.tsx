import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { MapProvider } from "@/context/MapContext"
import { useMapaConfig } from "@/hooks/useMapaConfig"
import { SidebarTemas } from "@/components/sidebar/SidebarTemas"
import { MapCanvas } from "@/components/map/MapCanvas"
import { TOCAccordion } from "@/components/map/TOCAccordion"
import { Button } from "@/components/ui/button"

function MapaPageContent() {
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
      <div className="flex flex-col items-center justify-center h-screen bg-muted">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Selecciona un mapa</h2>
        <p className="text-muted-foreground mb-4">
          Elige un mapa temático del panel izquierdo para comenzar.
        </p>
        <Button onClick={() => navigate("/mapa/bienes-view")}>
          Ir a Gestión de Bienes Municipales
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SidebarTemas />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
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
          </div>
        </div>

        <TOCAccordion capas={mapaConfig?.capas || []} />
        
        <div className="flex-1 relative">
          <MapCanvas
            config={mapaConfig}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}

export default function MapaPage() {
  return (
    <MapProvider>
      <MapaPageContent />
    </MapProvider>
  )
}
