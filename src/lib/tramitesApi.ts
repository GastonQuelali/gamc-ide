import axios from "axios"
import type { TramiteFiltros, TramitesResponse, TramitesParams } from "@/types/tramites"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"

const getToken = (): string | null => {
  return localStorage.getItem("gamc_token")
}

const tramitesClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

tramitesClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

tramitesClient.interceptors.response.use(
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

export const tramitesApi = {
  getFiltros: async (gestion?: number): Promise<TramiteFiltros> => {
    const params = new URLSearchParams()
    if (gestion) params.append("gestion", String(gestion))
    const response = await tramitesClient.get<TramiteFiltros>(`/tramites/filtros?${params}`)
    return response.data
  },

  getTramites: async (params: TramitesParams = {}): Promise<TramitesResponse> => {
    const searchParams = new URLSearchParams()
    if (params.gestion) searchParams.append("gestion", String(params.gestion))
    if (params.mes) searchParams.append("mes", String(params.mes))
    if (params.tipo) searchParams.append("tipo", params.tipo)
    if (params.comuna) searchParams.append("comuna", params.comuna)
    if (params.estado) searchParams.append("estado", params.estado)
    if (params.q) searchParams.append("q", params.q)
    if (params.pagina) searchParams.append("pagina", String(params.pagina))
    if (params.por_pagina) searchParams.append("por_pagina", String(params.por_pagina))
    
    const response = await tramitesClient.get<TramitesResponse>(`/tramites/?${searchParams}`)
    return response.data
  },
}
