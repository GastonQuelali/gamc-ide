import { useState, useEffect, useCallback } from "react"
import { catalogoApi } from "@/lib/api"
import type { TemaMapa, MapaConfig } from "@/types/mapa.types"

interface UseMapaConfigReturn {
  mapaConfig: MapaConfig | null
  temas: TemaMapa[]
  loading: boolean
  error: string | null
  loadMapaConfig: (slug: string) => Promise<void>
  loadTemas: () => Promise<void>
}

export function useMapaConfig(): UseMapaConfigReturn {
  const [mapaConfig, setMapaConfig] = useState<MapaConfig | null>(null)
  const [temas, setTemas] = useState<TemaMapa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMapaConfig = useCallback(async (slug: string) => {
    setLoading(true)
    setError(null)
    setMapaConfig(null)

    try {
      const data = await catalogoApi.getMapaConfig(slug)
      setMapaConfig(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar configuración del mapa"
      setError(message)
      console.error("Error loading mapa config:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTemas = useCallback(async () => {
    try {
      const data = await catalogoApi.getMapas()
      setTemas(data)
    } catch (err) {
      console.error("Error loading temas:", err)
    }
  }, [])

  useEffect(() => {
    loadTemas()
  }, [loadTemas])

  return {
    mapaConfig,
    temas,
    loading,
    error,
    loadMapaConfig,
    loadTemas,
  }
}
