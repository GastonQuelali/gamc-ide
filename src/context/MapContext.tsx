import { createContext, useContext, useState, type ReactNode } from "react"
import Map from "@arcgis/core/Map"
import type MapView from "@arcgis/core/views/MapView"
import type Layer from "@arcgis/core/layers/Layer"
import type { CapaGis } from "@/types/mapa.types"

type ArcGISMapInstance = InstanceType<typeof Map>

interface MapContextValue {
  map: ArcGISMapInstance | null
  view: MapView | null
  capas: globalThis.Map<number, Layer>
  loading: boolean
  error: string | null
  setMap: (map: ArcGISMapInstance) => void
  setView: (view: MapView) => void
  addCapa: (capa: CapaGis, layer: Layer) => void
  removeCapa: (id: number) => void
  setVisibilidad: (id: number, visible: boolean) => void
  setOpacidad: (id: number, opacidad: number) => void
  clearCapas: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const MapContext = createContext<MapContextValue | undefined>(undefined)

interface MapProviderProps {
  children: ReactNode
}

export function MapProvider({ children }: MapProviderProps) {
  const [capas] = useState<globalThis.Map<number, Layer>>(() => new globalThis.Map())
  const [map, setMap] = useState<ArcGISMapInstance | null>(null)
  const [view, setView] = useState<MapView | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addCapa = (capa: CapaGis, layer: Layer) => {
    if (!map) return
    
    const existingIndex = map.layers.findIndex((l) => l.id === String(capa.id_relacion))
    if (existingIndex !== -1) {
      map.layers.removeAt(existingIndex)
    }
    
    capas.set(capa.id_relacion, layer)
    map.add(layer)
  }

  const removeCapa = (id: number) => {
    if (!map) return
    
    const layer = capas.get(id)
    if (layer) {
      map.remove(layer)
      capas.delete(id)
    }
  }

  const setVisibilidad = (id: number, visible: boolean) => {
    const layer = capas.get(id)
    if (layer) {
      layer.visible = visible
    }
  }

  const setOpacidad = (id: number, opacidad: number) => {
    const layer = capas.get(id)
    if (layer) {
      layer.opacity = opacidad
    }
  }

  const clearCapas = () => {
    if (!map) return
    
    capas.forEach((layer: Layer) => {
      map.remove(layer)
    })
    capas.clear()
  }

  const value: MapContextValue = {
    map,
    view,
    capas,
    loading,
    error,
    setMap,
    setView,
    addCapa,
    removeCapa,
    setVisibilidad,
    setOpacidad,
    clearCapas,
    setLoading,
    setError,
  }

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export function useMapContext() {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider")
  }
  return context
}
