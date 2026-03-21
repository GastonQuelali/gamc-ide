import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CapaAsignada } from "@/types/mapa.types"
import type { CapaGIS } from "@/lib/api"

interface CapaEditable {
  id: number
  capa_id: number
  nombre: string
  url_servicio: string
  tipo: string
  grupo: string | null
  orden: number
  visible: boolean
  opacidad: number
}

interface MapAdminContextValue {
  capasDisponibles: CapaGIS[]
  capasAsignadas: CapaEditable[]
  loading: boolean
  saving: boolean
  error: string | null
  hasChanges: boolean
  loadCapasDisponibles: () => Promise<void>
  loadCapasAsignadas: (mapaId: number) => Promise<void>
  agregarCapa: (capa: CapaGIS) => void
  quitarCapa: (id: number) => void
  moverCapaArriba: (index: number) => void
  moverCapaAbajo: (index: number) => void
  toggleVisible: (id: number) => void
  setOpacidad: (id: number, opacidad: number) => void
  guardarCambios: (mapaId: number) => Promise<boolean>
  resetCambios: () => void
}

const MapAdminContext = createContext<MapAdminContextValue | undefined>(undefined)

interface MapAdminProviderProps {
  children: ReactNode
}

export function MapAdminProvider({ children }: MapAdminProviderProps) {
  const [capasDisponibles, setCapasDisponibles] = useState<CapaGIS[]>([])
  const [capasAsignadas, setCapasAsignadas] = useState<CapaEditable[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalAsignadas, setOriginalAsignadas] = useState<CapaEditable[]>([])

  const loadCapasDisponibles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { mapasAdminApi } = await import("@/lib/api")
      const capas = await mapasAdminApi.getCapasDisponibles()
      setCapasDisponibles(capas.filter((c) => c.activa))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar capas")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCapasAsignadas = useCallback(async (mapaId: number) => {
    setLoading(true)
    setError(null)
    try {
      const { mapasAdminApi } = await import("@/lib/api")
      const capas: CapaAsignada[] = await mapasAdminApi.getCapasAsignadas(mapaId)
      const editables: CapaEditable[] = capas.map((c) => ({
        ...c,
        id: c.id,
      }))
      setCapasAsignadas(editables)
      setOriginalAsignadas(editables)
      setHasChanges(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar capas asignadas")
    } finally {
      setLoading(false)
    }
  }, [])

  const agregarCapa = useCallback((capa: CapaGIS) => {
    const maxOrden = capasAsignadas.reduce((max, c) => Math.max(max, c.orden), 0)
    const nuevaCapa: CapaEditable = {
      id: Date.now(),
      capa_id: capa.id,
      nombre: capa.nombre,
      url_servicio: capa.url_servicio,
      tipo: capa.tipo || "feature",
      grupo: capa.grupo,
      orden: maxOrden + 1,
      visible: true,
      opacidad: 1,
    }
    setCapasAsignadas((prev) => [...prev, nuevaCapa])
    setHasChanges(true)
  }, [capasAsignadas])

  const quitarCapa = useCallback((id: number) => {
    setCapasAsignadas((prev) => prev.filter((c) => c.id !== id))
    setHasChanges(true)
  }, [])

  const moverCapaArriba = useCallback((index: number) => {
    if (index <= 0) return
    setCapasAsignadas((prev) => {
      const newCapas = [...prev]
      const temp = newCapas[index].orden
      newCapas[index].orden = newCapas[index - 1].orden
      newCapas[index - 1].orden = temp
      const [moved] = newCapas.splice(index, 1)
      newCapas.splice(index - 1, 0, moved)
      return newCapas
    })
    setHasChanges(true)
  }, [])

  const moverCapaAbajo = useCallback((index: number) => {
    setCapasAsignadas((prev) => {
      if (index >= prev.length - 1) return prev
      const newCapas = [...prev]
      const temp = newCapas[index].orden
      newCapas[index].orden = newCapas[index + 1].orden
      newCapas[index + 1].orden = temp
      const [moved] = newCapas.splice(index, 1)
      newCapas.splice(index + 1, 0, moved)
      return newCapas
    })
    setHasChanges(true)
  }, [])

  const toggleVisible = useCallback((id: number) => {
    setCapasAsignadas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    )
    setHasChanges(true)
  }, [])

  const setOpacidad = useCallback((id: number, opacidad: number) => {
    setCapasAsignadas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, opacidad } : c))
    )
    setHasChanges(true)
  }, [])

  const guardarCambios = useCallback(async (mapaId: number): Promise<boolean> => {
    setSaving(true)
    setError(null)
    try {
      const { mapasAdminApi } = await import("@/lib/api")
      const capasData = capasAsignadas.map((c, index) => ({
        capa_id: c.capa_id,
        orden: index + 1,
        visible: c.visible,
        opacidad: c.opacidad,
      }))
      await mapasAdminApi.asignarCapas(mapaId, { capas: capasData })
      setOriginalAsignadas(capasAsignadas)
      setHasChanges(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar cambios")
      return false
    } finally {
      setSaving(false)
    }
  }, [capasAsignadas])

  const resetCambios = useCallback(() => {
    setCapasAsignadas(originalAsignadas)
    setHasChanges(false)
  }, [originalAsignadas])

  const value: MapAdminContextValue = {
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
  }

  return <MapAdminContext.Provider value={value}>{children}</MapAdminContext.Provider>
}

export function useMapAdmin() {
  const context = useContext(MapAdminContext)
  if (!context) {
    throw new Error("useMapAdmin must be used within a MapAdminProvider")
  }
  return context
}
