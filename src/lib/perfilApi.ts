import axios from "axios"
import type { Perfil, PerfilUpdate } from "@/types/perfil"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"

const getToken = (): string | null => {
  return localStorage.getItem("gamc_token")
}

const perfilClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

perfilClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

perfilClient.interceptors.response.use(
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

export const perfilApi = {
  getPerfil: async (): Promise<Perfil> => {
    const response = await perfilClient.get<Perfil>("/perfil/")
    return response.data
  },

  updatePerfil: async (data: PerfilUpdate): Promise<Perfil> => {
    const response = await perfilClient.put<Perfil>("/perfil/", data)
    return response.data
  },

  uploadAvatar: async (file: File): Promise<Perfil> => {
    const formData = new FormData()
    formData.append("archivo", file)
    const response = await perfilClient.post<Perfil>("/perfil/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}
