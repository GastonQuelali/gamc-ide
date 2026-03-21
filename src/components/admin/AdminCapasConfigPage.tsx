import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Loader2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { MapAdminProvider, useMapAdmin } from "@/context/MapAdminContext"

function AdminCapasConfigContent() {
  const params = useParams()
  const navigate = useNavigate()
  const mapaId = Number(params.id)
  
  const {
    capasDisponibles,
    capasAsignadas,
    loading,
    saving,
    error,
    hasChanges,
    loadCapasDisponibles,
    loadCapasAsignadas,
    agregarCapa,
    quitarCapa,
    moverCapaArriba,
    moverCapaAbajo,
    toggleVisible,
    setOpacidad,
    guardarCambios,
    resetCambios,
  } = useMapAdmin()

  useEffect(() => {
    loadCapasDisponibles()
    loadCapasAsignadas(mapaId)
  }, [mapaId, loadCapasDisponibles, loadCapasAsignadas])

  const capasAsignadasIds = new Set(capasAsignadas.map((c) => c.capa_id))
  const capasLibres = capasDisponibles.filter((c) => !capasAsignadasIds.has(c.id))

  const handleGuardar = async () => {
    const success = await guardarCambios(mapaId)
    if (success) {
      navigate("/admin/mapas")
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/mapas")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Mapas
        </Button>
        <div className="h-6 w-px bg-border" />
        <h1 className="text-2xl font-bold">Configurar Capas</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Capas Disponibles
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {capasLibres.length} capas disponibles para agregar
            </p>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                {capasLibres.map((capa) => (
                  <div
                    key={capa.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{capa.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {capa.url_servicio}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => agregarCapa(capa)}
                      className="ml-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {capasLibres.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Todas las capas ya están asignadas
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              Capas Asignadas
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {capasAsignadas.length} capas • Orden de arriba hacia abajo
            </p>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                {capasAsignadas.map((capa, index) => (
                  <div
                    key={capa.id}
                    className="p-3 bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <button
                        onClick={() => toggleVisible(capa.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {capa.visible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{capa.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Orden: {index + 1}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moverCapaArriba(index)}
                          disabled={index === 0}
                          className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moverCapaAbajo(index)}
                          disabled={index === capasAsignadas.length - 1}
                          className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => quitarCapa(capa.id)}
                          className="p-1 hover:bg-muted rounded text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 pl-7 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Opacidad</span>
                      <Slider
                        value={[capa.opacidad]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={([value]) => setOpacidad(capa.id, value)}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {Math.round(capa.opacidad * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
                {capasAsignadas.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No hay capas asignadas. Agrega capas desde la izquierda.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={resetCambios} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Descartar Cambios
          </Button>
          <Button onClick={handleGuardar} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  )
}

export function AdminCapasConfigPage() {
  return (
    <MapAdminProvider>
      <AdminCapasConfigContent />
    </MapAdminProvider>
  )
}
