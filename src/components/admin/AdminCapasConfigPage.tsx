import { useEffect, useState, useCallback } from "react"
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
  Search,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { MapAdminProvider, useMapAdmin } from "@/context/MapAdminContext"
import { mapasAdminApi } from "@/lib/api"
import type { MapaConfig } from "@/types/mapa.types"

function AdminCapasConfigContent() {
  const params = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const slug = params.slug
  
  const [mapaConfig, setMapaConfig] = useState<MapaConfig | null>(null)
  const [mapaLoading, setMapaLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  
  const {
    capasDisponibles,
    capasAsignadas,
    loading,
    saving,
    error,
    hasChanges,
    loadCapasDisponibles,
    setCapasAsignadasFromMapa,
    setCapasAsignadas,
    agregarCapa,
    quitarCapa,
    moverCapaArriba,
    moverCapaAbajo,
    toggleVisible,
    setOpacidad,
    guardarCambios,
    resetCambios,
    setHasChanges,
  } = useMapAdmin()

  const startEditing = (id: number, nombre: string) => {
    setEditingId(id)
    setEditValue(nombre)
  }

  const saveEdit = () => {
    if (editingId !== null) {
      setCapasAsignadas((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, nombre: editValue } : c))
      )
      setHasChanges(true)
    }
    setEditingId(null)
    setEditValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit()
    if (e.key === "Escape") {
      setEditingId(null)
      setEditValue("")
    }
  }

  const loadMapaDetalle = useCallback(async (mapaSlug: string) => {
    setMapaLoading(true)
    try {
      const config = await mapasAdminApi.getMapaDetalle(mapaSlug)
      setMapaConfig(config)
      
      await loadCapasDisponibles()
      setCapasAsignadasFromMapa(config.capas)
    } catch (err) {
      console.error("Error loading mapa:", err)
    } finally {
      setMapaLoading(false)
    }
  }, [loadCapasDisponibles, setCapasAsignadasFromMapa])

  useEffect(() => {
    if (slug) {
      loadMapaDetalle(slug)
    }
  }, [slug, loadMapaDetalle])

  const capasAsignadasIds = new Set(capasAsignadas.map((c) => c.capa_id))
  const capasLibres = capasDisponibles.filter((c) => !capasAsignadasIds.has(c.id))
  
  const capasFiltradas = searchTerm.length >= 3
    ? capasLibres.filter((c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.url_servicio.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : capasLibres

  const getTipoBadgeClasses = (tipo: string | null) => {
    const baseClasses = "shrink-0 px-1.5 py-0.5 text-xs rounded font-medium border"
    const lowerTipo = tipo?.toLowerCase() || ""
    
    if (lowerTipo.includes("feature")) {
      return `${baseClasses} bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700`
    }
    if (lowerTipo.includes("raster")) {
      return `${baseClasses} bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700`
    }
    if (lowerTipo.includes("tile")) {
      return `${baseClasses} bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700`
    }
    if (lowerTipo.includes("image") || lowerTipo.includes("map")) {
      return `${baseClasses} bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700`
    }
    return `${baseClasses} bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`
  }

  const getGrupoBadgeClasses = () => {
    return "shrink-0 px-1.5 py-0.5 text-xs rounded font-medium border bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
  }

  const handleGuardar = async () => {
    if (!mapaConfig) return
    const success = await guardarCambios(mapaConfig.mapa_id)
    if (success) {
      navigate("/admin/mapas")
    }
  }

  if (mapaLoading) {
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
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
              {capasFiltradas.length === capasLibres.length
                ? `${capasLibres.length} capas disponibles`
                : `${capasFiltradas.length} de ${capasLibres.length} capas`}
              {searchTerm.length >= 3 && " • Filtrado"}
            </p>
          </div>
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre o URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                {capasFiltradas.map((capa) => (
                  <div
                    key={capa.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{capa.nombre}</p>
                        {capa.tipo && (
                          <span className={getTipoBadgeClasses(capa.tipo)}>
                            {capa.tipo}
                          </span>
                        )}
                        {capa.grupo && (
                          <span className={getGrupoBadgeClasses()}>
                            {capa.grupo}
                          </span>
                        )}
                      </div>
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
                {capasFiltradas.length === 0 && capasLibres.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Todas las capas ya están asignadas
                  </p>
                )}
                {capasFiltradas.length === 0 && capasLibres.length > 0 && (
                  <p className="text-center text-destructive py-4">
                    Sin resultados para "{searchTerm}"
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
                    className="p-3 bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors relative group"
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
                        {editingId === capa.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full px-1 py-0.5 text-sm border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        ) : (
                          <p
                            className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                            onClick={() => startEditing(capa.id, capa.nombre)}
                          >
                            {capa.nombre}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Orden: {index + 1}
                        </p>
                      </div>
                      <button
                        onClick={() => startEditing(capa.id, capa.nombre)}
                        className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
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
