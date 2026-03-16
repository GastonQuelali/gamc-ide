import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { tramitesApi } from "@/lib/tramitesApi"
import type { Tramite, TramitesParams, TramiteFiltros, TramiteResumen } from "@/types/tramites"

interface UseTramitesReturn {
  tramites: Tramite[]
  total: number
  paginas: number
  pagina: number
  filtros: TramitesParams
  filtrosDisponibles: TramiteFiltros | null
  resumen: TramiteResumen | null
  loading: boolean
  error: string | null
  setFiltros: (f: Partial<TramitesParams>) => void
  setPagina: (p: number) => void
  limpiarFiltros: () => void
}

export function useTramites(): UseTramitesReturn {
  const currentYear = new Date().getFullYear()
  
  const [filtros, setFiltros] = useState<TramitesParams>({
    gestion: currentYear,
    pagina: 1,
    por_pagina: 20,
  })
  
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [total, setTotal] = useState(0)
  const [paginas, setPaginas] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<TramiteFiltros | null>(null)
  const [resumen, setResumen] = useState<TramiteResumen | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      
      try {
        const [tablaResponse, resumenResponse]: [any, TramiteResumen] = await Promise.all([
          tramitesApi.getTramites(filtros),
          tramitesApi.getResumen(filtros),
        ])

        if (!mounted) return

        setTramites(tablaResponse.tramites)
        setTotal(tablaResponse.total)
        setPaginas(tablaResponse.paginas)
        setPagina(tablaResponse.pagina)
        setResumen(resumenResponse)

        if (!filtrosDisponibles) {
          const filtrosData = await tramitesApi.getFiltros(filtros.gestion)
          setFiltrosDisponibles(filtrosData)
        }
      } catch (err) {
        if (!mounted) return

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
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [filtros])

  const handleSetFiltros = useCallback((nuevosFiltros: Partial<TramitesParams>) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros,
      pagina: nuevosFiltros.pagina ?? 1,
    }))
  }, [])

  const handleSetPagina = useCallback((p: number) => {
    setFiltros(prev => ({ ...prev, pagina: p }))
  }, [])

  const handleLimpiarFiltros = useCallback(() => {
    setFiltros({
      gestion: currentYear,
      pagina: 1,
      por_pagina: 20,
    })
  }, [currentYear])

  return {
    tramites,
    total,
    paginas,
    pagina,
    filtros,
    filtrosDisponibles,
    resumen,
    loading,
    error,
    setFiltros: handleSetFiltros,
    setPagina: handleSetPagina,
    limpiarFiltros: handleLimpiarFiltros,
  }
}
