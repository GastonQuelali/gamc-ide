import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { kpiApi } from "@/lib/kpiApi"
import type { KPIResumen, KPIPorMes, KPIPorTipo, KPIPorComuna, KPIEvolucion, KPIFilters } from "@/types/kpi"

interface UseKPIReturn {
  resumen: KPIResumen | null
  porMes: KPIPorMes[]
  porTipo: KPIPorTipo[]
  porComuna: KPIPorComuna[]
  evolucionAnual: KPIEvolucion[]
  loading: boolean
  error: string | null
  filtros: KPIFilters
  setFiltros: (f: KPIFilters) => void
  invalidarCache: () => Promise<void>
  refetch: () => void
}

export function useKPI(): UseKPIReturn {
  const currentYear = new Date().getFullYear()
  
  const [filtros, setFiltros] = useState<KPIFilters>({
    gestion: currentYear,
    limite: 10,
    anios: 5,
  })
  
  const [resumen, setResumen] = useState<KPIResumen | null>(null)
  const [porMes, setPorMes] = useState<KPIPorMes[]>([])
  const [porTipo, setPorTipo] = useState<KPIPorTipo[]>([])
  const [porComuna, setPorComuna] = useState<KPIPorComuna[]>([])
  const [evolucionAnual, setEvolucionAnual] = useState<KPIEvolucion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [resumenData, porMesData, porTipoData, porComunaData, evolucionData] = await Promise.all([
        kpiApi.getResumen(),
        kpiApi.getPorMes(filtros.gestion, filtros.limite),
        kpiApi.getPorTipo(filtros.gestion, filtros.limite),
        kpiApi.getPorComuna(filtros.gestion, filtros.limite),
        kpiApi.getEvolucionAnual(filtros.anios),
      ])

      setResumen(resumenData)
      setPorMes(porMesData)
      setPorTipo(porTipoData)
      setPorComuna(porComunaData)
      setEvolucionAnual(evolucionData)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Sesión expirada. Redirigiendo...")
          setTimeout(() => {
            localStorage.removeItem("gamc_token")
            localStorage.removeItem("gamc_current_user")
            window.location.href = "/"
          }, 2000)
        } else if (err.response?.status === 403) {
          setError("Sin acceso a estos datos")
        } else if (err.response?.status === 500) {
          setError("Error interno del servidor")
        } else {
          setError("Error de conexión. Verifica que el servidor esté activo.")
        }
      } else {
        setError("Error desconocido")
      }
      console.error("KPI Error:", err)
    } finally {
      setLoading(false)
    }
  }, [filtros.gestion, filtros.limite, filtros.anios])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const invalidarCache = async () => {
    try {
      await kpiApi.invalidarCache()
      await fetchData()
    } catch (err) {
      console.error("Error invalidando cache:", err)
      throw err
    }
  }

  const refetch = () => {
    fetchData()
  }

  return {
    resumen,
    porMes,
    porTipo,
    porComuna,
    evolucionAnual,
    loading,
    error,
    filtros,
    setFiltros,
    invalidarCache,
    refetch,
  }
}
