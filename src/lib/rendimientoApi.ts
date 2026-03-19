import axios from "axios"
import type { RendimientoParams, RendimientoResumen, FuncionarioRendimiento, FuncionarioRanking, TramitePendiente, RendimientoFiltrosDisponibles, CacheStats } from "@/types/rendimiento"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"

const getToken = (): string | null => {
  return localStorage.getItem("gamc_token")
}

const rendimientoClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

rendimientoClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

rendimientoClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("gamc_token")
      localStorage.removeItem("gamc_current_user")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

const buildParams = (params: RendimientoParams) => {
  const searchParams = new URLSearchParams()
  if (params.periodo) searchParams.append("periodo", params.periodo)
  if (params.fecha) searchParams.append("fecha", params.fecha)
  if (params.gestion) searchParams.append("gestion", String(params.gestion))
  if (params.unidad) searchParams.append("unidad", params.unidad)
  if (params.comuna) searchParams.append("comuna", params.comuna)
  if (params.dias_vencimiento) searchParams.append("dias_vencimiento", String(params.dias_vencimiento))
  return searchParams.toString()
}

type RequestSignal = { signal?: AbortSignal }

export const rendimientoApi = {
  getResumen: async (params: RendimientoParams, options?: RequestSignal): Promise<RendimientoResumen> => {
    const response = await rendimientoClient.get<RendimientoResumen>(`/rendimiento/resumen?${buildParams(params)}`, options)
    return response.data
  },

  getPorFuncionario: async (params: RendimientoParams, options?: RequestSignal): Promise<FuncionarioRendimiento[]> => {
    const response = await rendimientoClient.get<FuncionarioRendimiento[]>(`/rendimiento/por-funcionario?${buildParams(params)}`, options)
    return response.data
  },

  getRanking: async (params: RendimientoParams, limite: number = 10, options?: RequestSignal): Promise<FuncionarioRanking[]> => {
    const searchParams = new URLSearchParams(buildParams(params))
    searchParams.append("limite", String(limite))
    const response = await rendimientoClient.get<FuncionarioRanking[]>(`/rendimiento/ranking?${searchParams}`, options)
    return response.data
  },

  getPendientesVencidos: async (params: RendimientoParams, options?: RequestSignal): Promise<TramitePendiente[]> => {
    const response = await rendimientoClient.get<TramitePendiente[]>(`/rendimiento/pendientes-vencidos?${buildParams(params)}`, options)
    return response.data
  },

  getFiltros: async (options?: RequestSignal): Promise<RendimientoFiltrosDisponibles> => {
    const response = await rendimientoClient.get<RendimientoFiltrosDisponibles>("/rendimiento/filtros", options)
    return response.data
  },

  exportar: async (params: RendimientoParams): Promise<Blob> => {
    const response = await rendimientoClient.get(`/rendimiento/exportar?${buildParams(params)}`, {
      responseType: "blob",
    })
    return response.data
  },

  getCacheStats: async (): Promise<CacheStats> => {
    const response = await rendimientoClient.get<CacheStats>("/rendimiento/cache/stats")
    return response.data
  },

  invalidarCache: async (): Promise<{ eliminadas: number }> => {
    const response = await rendimientoClient.post<{ eliminadas: number }>("/rendimiento/cache/invalidar")
    return response.data
  },
}
