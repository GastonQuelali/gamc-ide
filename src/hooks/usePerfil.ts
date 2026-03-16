import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { perfilApi } from "@/lib/perfilApi"
import type { Perfil, PerfilUpdate } from "@/types/perfil"

interface UsePerfilReturn {
  perfil: Perfil | null
  loading: boolean
  error: string | null
  fetchPerfil: () => Promise<void>
  updatePerfil: (data: PerfilUpdate) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
}

export function usePerfil(): UsePerfilReturn {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerfil = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await perfilApi.getPerfil()
      setPerfil(data)
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
      console.error("Perfil Error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePerfil = useCallback(async (data: PerfilUpdate) => {
    setLoading(true)
    setError(null)

    try {
      const updated = await perfilApi.updatePerfil(data)
      setPerfil(updated)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Sesión expirada. Redirigiendo...")
          setTimeout(() => {
            localStorage.removeItem("gamc_token")
            localStorage.removeItem("gamc_current_user")
            window.location.href = "/"
          }, 2000)
        } else if (err.response?.status === 500) {
          setError("Error interno del servidor")
        } else {
          setError("Error al actualizar perfil")
        }
      } else {
        setError("Error desconocido")
      }
      console.error("Perfil Update Error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadAvatar = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      const updated = await perfilApi.uploadAvatar(file)
      setPerfil(updated)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const detail = err.response.data?.detail
          if (typeof detail === "string" && detail.includes("5 MB")) {
            setError("El archivo supera el tamaño máximo de 5 MB")
          } else if (typeof detail === "string") {
            setError(detail)
          } else {
            setError("Formato no permitido. Usa: jpg, jpeg, png, webp")
          }
        } else if (err.response?.status === 401) {
          setError("Sesión expirada. Redirigiendo...")
          setTimeout(() => {
            localStorage.removeItem("gamc_token")
            localStorage.removeItem("gamc_current_user")
            window.location.href = "/"
          }, 2000)
        } else {
          setError("Error al subir avatar")
        }
      } else {
        setError("Error desconocido")
      }
      console.error("Avatar Upload Error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPerfil()
  }, [fetchPerfil])

  return {
    perfil,
    loading,
    error,
    fetchPerfil,
    updatePerfil,
    uploadAvatar,
  }
}
