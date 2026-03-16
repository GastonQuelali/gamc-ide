import { useState, useEffect } from "react"
import axios from "axios"
import { tramitesApi } from "@/lib/tramitesApi"
import type { Tramite, TramitesResponse, TramitesParams, TramiteFiltros } from "@/types/tramites"

interface UseTramitesReturn {
  tramites: Tramite[]
  total: number
  paginas: number
  pagina: number
  filtros: TramitesParams
  filtrosDisponibles: TramiteFiltros | null
  loading: boolean
  error: string | null
  setFiltros: (f: TramitesParams) => void
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      
      try {
        const [filtrosData, tramitesData]: [TramiteFiltros, TramitesResponse] = await Promise.all([
          tramitesApi.getFiltros(filtros.gestion),
          tramitesApi.getTramites(filtros),
        ])

        if (!mounted) return

        setFiltrosDisponibles(filtrosData)
        setTramites(tramitesData.tramites)
        setTotal(tramitesData.total)
        setPaginas(tramitesData.paginas)
        setPagina(tramitesData.pagina)
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
  }, [filtros.gestion, filtros.mes, filtros.tipo, filtros.comuna, filtros.estado, filtros.q, filtros.pagina, filtros.por_pagina])

  const handleSetFiltros = (nuevosFiltros: Partial<TramitesParams>) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros,
      pagina: nuevosFiltros.pagina ?? 1,
    }))
  }

  const handleSetPagina = (p: number) => {
    setFiltros(prev => ({ ...prev, pagina: p }))
  }

  const handleLimpiarFiltros = () => {
    setFiltros({
      gestion: currentYear,
      pagina: 1,
      por_pagina: 20,
    })
  }

  return {
    tramites,
    total,
    paginas,
    pagina,
    filtros,
    filtrosDisponibles,
    loading,
    error,
    setFiltros: handleSetFiltros,
    setPagina: handleSetPagina,
    limpiarFiltros: handleLimpiarFiltros,
  }
}
