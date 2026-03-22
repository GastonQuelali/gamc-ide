import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import Map from "@arcgis/core/Map"
import type MapView from "@arcgis/core/views/MapView"
import type Layer from "@arcgis/core/layers/Layer"
import type { CapaGis } from "@/types/mapa.types"

type ArcGISMapInstance = InstanceType<typeof Map>

interface LayerState {
  visible: boolean
  opacidad: number
}

interface MapContextValue {
  map: ArcGISMapInstance | null
  view: MapView | null
  capas: globalThis.Map<number, Layer>
  layerStates: Record<number, LayerState>
  loading: boolean
  error: string | null
  currentSlug: string | null
  setMap: (map: ArcGISMapInstance) => void
  setView: (view: MapView) => void
  addCapa: (capa: CapaGis, layer: Layer) => void
  removeCapa: (id: number) => void
  setVisibilidad: (id: number, visible: boolean) => void
  setOpacidad: (id: number, opacidad: number) => void
  clearCapas: () => void
  clearMap: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentSlug: (slug: string | null) => void
}

const INACTIVITY_TIMEOUT = 5 * 60 * 1000
const STORAGE_KEY = "gamc_layer_states"

const MapContext = createContext<MapContextValue | undefined>(undefined)

function loadLayerStates(): Record<number, LayerState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveLayerStates(states: Record<number, LayerState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch (e) {
    console.warn("Failed to save layer states:", e)
  }
}

interface MapProviderProps {
  children: ReactNode
}

export function MapProvider({ children }: MapProviderProps) {
  const [capas] = useState<globalThis.Map<number, Layer>>(() => new globalThis.Map())
  const [map, setMap] = useState<ArcGISMapInstance | null>(null)
  const [view, setView] = useState<MapView | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [layerStates, setLayerStates] = useState<Record<number, LayerState>>(loadLayerStates)
  const [lastMapAccess, setLastMapAccess] = useState<number>(Date.now())
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)
  
  const location = useLocation()
  const cleanupIntervalRef = useRef<number | null>(null)
  const isOnMapRoute = location.pathname.startsWith("/mapa/")

  const updateLayerAccess = useCallback(() => {
    setLastMapAccess(Date.now())
  }, [])

  const persistLayerStates = useCallback((states: Record<number, LayerState>) => {
    saveLayerStates(states)
  }, [])

  const addCapa = useCallback((capa: CapaGis, layer: Layer) => {
    if (!map) return
    
    const existingIndex = map.layers.findIndex((l) => l.id === String(capa.id_relacion))
    if (existingIndex !== -1) {
      map.layers.removeAt(existingIndex)
    }
    
    capas.set(capa.id_relacion, layer)
    map.add(layer)

    const savedState = layerStates[capa.id_relacion]
    if (savedState) {
      layer.visible = savedState.visible
      layer.opacity = savedState.opacidad
    }
    
    updateLayerAccess()
  }, [map, capas, layerStates, updateLayerAccess])

  const removeCapa = useCallback((id: number) => {
    if (!map) return
    
    const layer = capas.get(id)
    if (layer) {
      map.remove(layer)
      capas.delete(id)
    }
  }, [map, capas])

  const setVisibilidad = useCallback((id: number, visible: boolean) => {
    const layer = capas.get(id)
    if (layer) {
      layer.visible = visible
      setLayerStates(prev => {
        const updated = { ...prev, [id]: { ...prev[id], visible, opacidad: prev[id]?.opacidad ?? 1 } }
        persistLayerStates(updated)
        return updated
      })
      updateLayerAccess()
    }
  }, [capas, persistLayerStates, updateLayerAccess])

  const setOpacidad = useCallback((id: number, opacidad: number) => {
    const layer = capas.get(id)
    if (layer) {
      layer.opacity = opacidad
      setLayerStates(prev => {
        const updated = { ...prev, [id]: { ...prev[id], visible: prev[id]?.visible ?? true, opacidad } }
        persistLayerStates(updated)
        return updated
      })
      updateLayerAccess()
    }
  }, [capas, persistLayerStates, updateLayerAccess])

  const clearCapas = useCallback(() => {
    if (!map) return
    
    capas.forEach((layer: Layer) => {
      map.remove(layer)
    })
    capas.clear()
  }, [map, capas])

  const clearMap = useCallback(() => {
    if (view) {
      view.destroy()
      setView(null)
    }
    setMap(null)
    clearCapas()
  }, [view, clearCapas])

  useEffect(() => {
    if (isOnMapRoute) {
      setLastMapAccess(Date.now())
    }
  }, [isOnMapRoute])

  useEffect(() => {
    if (cleanupIntervalRef.current) {
      window.clearInterval(cleanupIntervalRef.current)
    }

    cleanupIntervalRef.current = window.setInterval(() => {
      const inactiveTime = Date.now() - lastMapAccess
      const currentIsOnMapRoute = location.pathname.startsWith("/mapa/")

      if (!currentIsOnMapRoute && inactiveTime > INACTIVITY_TIMEOUT && view) {
        console.log("MapView cleanup: inactive for", Math.round(inactiveTime / 1000), "seconds")
        clearMap()
      }
    }, 60000)

    return () => {
      if (cleanupIntervalRef.current) {
        window.clearInterval(cleanupIntervalRef.current)
      }
    }
  }, [lastMapAccess, view, location.pathname, clearMap])

  const value: MapContextValue = {
    map,
    view,
    capas,
    layerStates,
    loading,
    error,
    currentSlug,
    setMap,
    setView,
    addCapa,
    removeCapa,
    setVisibilidad,
    setOpacidad,
    clearCapas,
    clearMap,
    setLoading,
    setError,
    setCurrentSlug,
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
