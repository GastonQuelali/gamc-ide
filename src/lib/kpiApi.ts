import axios from "axios"
import type { KPIResumen, KPIPorMes, KPIPorTipo, KPIPorComuna, KPIEvolucion, KPITiempoResolucion, KPITasaConclusion, KPIEnMora } from "@/types/kpi"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"

const getToken = (): string | null => {
  return localStorage.getItem("gamc_token")
}

const kpiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

kpiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

kpiClient.interceptors.response.use(
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

export const kpiApi = {
  getResumen: async (): Promise<KPIResumen> => {
    const response = await kpiClient.get<KPIResumen>("/admin/kpi/resumen")
    return response.data
  },

  getPorMes: async (gestion?: number, limite?: number): Promise<KPIPorMes[]> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    if (limite) params.append("limite", String(limite))
    const response = await kpiClient.get<KPIPorMes[]>(`/admin/kpi/por-mes?${params}`)
    return response.data
  },

  getPorTipo: async (gestion?: number, limite?: number): Promise<KPIPorTipo[]> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    if (limite) params.append("limite", String(limite))
    const response = await kpiClient.get<KPIPorTipo[]>(`/admin/kpi/por-tipo?${params}`)
    return response.data
  },

  getPorComuna: async (gestion?: number, limite?: number): Promise<KPIPorComuna[]> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    if (limite) params.append("limite", String(limite))
    const response = await kpiClient.get<KPIPorComuna[]>(`/admin/kpi/por-comuna?${params}`)
    return response.data
  },

  getEvolucionAnual: async (anios?: number): Promise<KPIEvolucion[]> => {
    const params = new URLSearchParams()
    if (anios) params.append("anios", String(anios))
    const response = await kpiClient.get<KPIEvolucion[]>(`/admin/kpi/evolucion-anual?${params}`)
    return response.data
  },

  invalidarCache: async (): Promise<void> => {
    const response = await kpiClient.post("/admin/kpi/cache/invalidar")
    return response.data
  },

  getTiempoResolucion: async (gestion?: number, limite?: number): Promise<KPITiempoResolucion[]> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    if (limite) params.append("limite", String(limite))
    const response = await kpiClient.get<KPITiempoResolucion[]>(`/admin/kpi/tiempo-resolucion?${params}`)
    return response.data
  },

  getTasaConclusion: async (gestion?: number): Promise<KPITasaConclusion[]> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    const response = await kpiClient.get<KPITasaConclusion[]>(`/admin/kpi/tasa-conclusion?${params}`)
    return response.data
  },

  getEnMora: async (gestion?: number): Promise<KPIEnMora> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    const response = await kpiClient.get<KPIEnMora>(`/admin/kpi/en-mora?${params}`)
    return response.data
  },
}
