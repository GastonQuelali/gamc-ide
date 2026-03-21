import { useEffect, useRef } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import Map from "@arcgis/core/Map"
import MapView from "@arcgis/core/views/MapView"
import Extent from "@arcgis/core/geometry/Extent"
import { useMapContext } from "@/context/MapContext"
import { INITIAL_EXTENT } from "@/config/mapConfig"
import { createCapaGis, sortCapasPorOrden } from "@/lib/layerFactory"
import type { MapaConfig } from "@/types/mapa.types"

interface MapCanvasProps {
  config: MapaConfig | null
  loading: boolean
  error: string | null
}

export function MapCanvas({ config, loading, error }: MapCanvasProps) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<MapView | null>(null)
  const { map, setMap, setView, addCapa, clearCapas, setLoading } = useMapContext()

  useEffect(() => {
    if (!mapDivRef.current) return

    const initMap = () => {
      if (map) return

      const newMap = new Map({
        basemap: "dark-gray-vector",
      })

      const view = new MapView({
        container: mapDivRef.current!,
        map: newMap,
        constraints: { rotationEnabled: false },
        extent: new Extent(INITIAL_EXTENT),
      })

      viewRef.current = view
      setMap(newMap)
      setView(view)
    }

    initMap()

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [map, setMap, setView])

  useEffect(() => {
    if (!map || !config) return

    setLoading(true)
    clearCapas()

    const capasOrdenadas = sortCapasPorOrden(config.capas)

    let loadedCount = 0
    const totalCapas = capasOrdenadas.length

    capasOrdenadas.forEach((capaGis) => {
      const layer = createCapaGis(capaGis)
      if (layer) {
        layer.load().then(() => {
          addCapa(capaGis, layer)
          loadedCount++
          if (loadedCount === totalCapas) {
            setLoading(false)
          }
        }).catch((err) => {
          console.error(`Error loading layer ${capaGis.nombre_amigable}:`, err)
          loadedCount++
          if (loadedCount === totalCapas) {
            setLoading(false)
          }
        })
      } else {
        loadedCount++
        if (loadedCount === totalCapas) {
          setLoading(false)
        }
      }
    })
  }, [map, config, addCapa, clearCapas, setLoading])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapDivRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Cargando capas...</span>
          </div>
        </div>
      )}
    </div>
  )
}
