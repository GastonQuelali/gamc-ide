import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { rendimientoApi } from "@/lib/rendimientoApi"
import type { RendimientoParams, RendimientoResumen, FuncionarioRendimiento, FuncionarioRanking, TramitePendiente, RendimientoFiltrosDisponibles, Periodo } from "@/types/rendimiento"

interface UseRendimientoReturn {
  params: RendimientoParams
  resumen: RendimientoResumen | null
  porFuncionario: FuncionarioRendimiento[]
  ranking: FuncionarioRanking[]
  pendientes: TramitePendiente[]
  filtrosDisponibles: RendimientoFiltrosDisponibles | null
  loadingResumen: boolean
  loadingFuncionarios: boolean
  loadingPendientes: boolean
  exportando: boolean
  error: string | null
  setParams: (params: RendimientoParams) => void
  setPeriodo: (periodo: Periodo) => void
  setFiltro: (key: keyof RendimientoParams, value: string | number | undefined) => void
  limpiarFiltros: () => void
  exportar: () => Promise<void>
  invalidarCache: () => Promise<void>
}

const getDefaultParams = (): RendimientoParams => {
  return {
    periodo: 'mes',
  }
}

export function useRendimiento(): UseRendimientoReturn {
  const [params, setParams] = useState<RendimientoParams>(getDefaultParams())
  const [resumen, setResumen] = useState<RendimientoResumen | null>(null)
  const [porFuncionario, setPorFuncionario] = useState<FuncionarioRendimiento[]>([])
  const [ranking, setRanking] = useState<FuncionarioRanking[]>([])
  const [pendientes, setPendientes] = useState<TramitePendiente[]>([])
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<RendimientoFiltrosDisponibles | null>(null)
  const [loadingResumen, setLoadingResumen] = useState(false)
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false)
  const [loadingPendientes, setLoadingPendientes] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFiltros = useCallback(async () => {
    try {
      const data = await rendimientoApi.getFiltros()
      setFiltrosDisponibles(data)
    } catch (err) {
      console.error("Error fetching filtros:", err)
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoadingResumen(true)
    setLoadingFuncionarios(true)
    setLoadingPendientes(true)
    setError(null)

    try {
      const [resumenRes, funcionariosRes, rankingRes, pendientesRes] = await Promise.all([
        rendimientoApi.getResumen(params),
        rendimientoApi.getPorFuncionario(params),
        rendimientoApi.getRanking(params, 10),
        rendimientoApi.getPendientesVencidos(params),
      ])

      setResumen(resumenRes)
      setPorFuncionario(funcionariosRes)
      setRanking(rankingRes)
      setPendientes(pendientesRes)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Sesión expirada. Redirigiendo...")
          setTimeout(() => {
            localStorage.removeItem("gamc_token")
            localStorage.removeItem("gamc_current_user")
            window.location.href = "/"
          }, 2000)
        } else {
          setError("Error al cargar datos de rendimiento")
        }
      } else {
        setError("Error desconocido")
      }
      console.error("Rendimiento Error:", err)
    } finally {
      setLoadingResumen(false)
      setLoadingFuncionarios(false)
      setLoadingPendientes(false)
    }
  }, [params])

  useEffect(() => {
    fetchFiltros()
  }, [fetchFiltros])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSetPeriodo = useCallback((periodo: Periodo) => {
    setParams((prev) => ({ ...prev, periodo, fecha: undefined, gestion: undefined }))
  }, [])

  const handleSetFiltro = useCallback((key: keyof RendimientoParams, value: string | number | undefined) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleLimpiarFiltros = useCallback(() => {
    setParams(getDefaultParams())
  }, [])

  const handleExportar = useCallback(async () => {
    setExportando(true)
    try {
      const blob = await rendimientoApi.exportar(params)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rendimiento_${params.periodo}_${params.fecha || new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export error:", err)
    } finally {
      setExportando(false)
    }
  }, [params])

  const handleInvalidarCache = useCallback(async () => {
    try {
      await rendimientoApi.invalidarCache()
      await fetchData()
    } catch (err) {
      console.error("Error invalidando cache:", err)
      throw err
    }
  }, [fetchData])

  return {
    params,
    resumen,
    porFuncionario,
    ranking,
    pendientes,
    filtrosDisponibles,
    loadingResumen,
    loadingFuncionarios,
    loadingPendientes,
    exportando,
    error,
    setParams,
    setPeriodo: handleSetPeriodo,
    setFiltro: handleSetFiltro,
    limpiarFiltros: handleLimpiarFiltros,
    exportar: handleExportar,
    invalidarCache: handleInvalidarCache,
  }
}
