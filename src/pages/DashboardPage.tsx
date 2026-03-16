import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Calendar, Clock, CheckCircle, RefreshCw, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useKPI } from "@/hooks/useKPI"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { KPICard } from "@/components/kpi/KPICard"
import { GraficoBarrasMes } from "@/components/kpi/GraficoBarrasMes"
import { GraficoPorTipo } from "@/components/kpi/GraficoPorTipo"
import { GraficoBarrasComunas } from "@/components/kpi/GraficoBarrasComunas"
import { GraficoEvolucion } from "@/components/kpi/GraficoEvolucion"
import type { UserRole } from "@/types/kpi"
import type { KPIPorMes, KPIPorTipo, KPIPorComuna } from "@/types/kpi"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

function DashboardContent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
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
  } = useKPI()

  const [invalidating, setInvalidating] = useState(false)
  const isAdmin = user?.role === "admin"

  const handleYearChange = (year: number) => {
    setFiltros({ ...filtros, gestion: year })
  }

  const irATramites = (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    })
    navigate(`/tramites?${searchParams.toString()}`)
  }

  const handleInvalidateCache = async () => {
    if (!isAdmin) return
    setInvalidating(true)
    try {
      await invalidarCache()
    } catch {
      // Error already handled in hook
    } finally {
      setInvalidating(false)
    }
  }

  const handleBarClick = (data: KPIPorMes) => {
    irATramites({ gestion: filtros.gestion, mes: data.mes })
  }

  const handleTipoClick = (data: KPIPorTipo) => {
    irATramites({ gestion: filtros.gestion, tipo: data.tipo })
  }

  const handleComunaClick = (data: KPIPorComuna) => {
    irATramites({ gestion: filtros.gestion, comuna: data.comuna })
  }

  if (error) {
    return (
      <Sidebar>
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refetch}>Reintentar</Button>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    )
  }

  const isCurrentYear = filtros.gestion === currentYear

  return (
    <Sidebar>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard de Indicadores</h1>
            <p className="text-muted-foreground">Trámites Catastrales — DAGyC</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={String(filtros.gestion)}
              onValueChange={(v) => handleYearChange(Number(v))}
            >
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </Select>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={handleInvalidateCache}
                disabled={invalidating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${invalidating ? "animate-spin" : ""}`} />
                {invalidating ? "Actualizando..." : "Actualizar"}
              </Button>
            )}
          </div>
        </div>

        {isCurrentYear && (
          <p className="text-sm text-muted-foreground mb-4">
            * Los datos de {currentYear} son parciales (hasta la fecha actual)
          </p>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            titulo="Total año actual"
            valor={resumen?.total_anio_actual ?? 0}
            comparacion={resumen?.variacion_anual_pct}
            icon={FileText}
            loading={loading}
            onClick={() => irATramites({ gestion: filtros.gestion })}
          />
          <KPICard
            titulo="Trámites este mes"
            valor={resumen?.total_mes_actual ?? 0}
            comparacion={resumen?.total_mes_anterior}
            icon={Calendar}
            loading={loading}
            onClick={() => irATramites({ gestion: filtros.gestion, mes: new Date().getMonth() + 1 })}
          />
          <KPICard
            titulo="En trámite"
            valor={resumen?.en_tramite ?? 0}
            icon={Clock}
            variant="warning"
            loading={loading}
            onClick={() => irATramites({ gestion: filtros.gestion, estado: "en_tramite" })}
          />
          <KPICard
            titulo="Concluidos"
            valor={resumen?.concluidos ?? 0}
            icon={CheckCircle}
            variant="success"
            loading={loading}
            onClick={() => irATramites({ gestion: filtros.gestion, estado: "concluido" })}
          />
        </div>

        {/* Monthly Chart */}
        <div className="mb-6">
          <GraficoBarrasMes data={porMes} gestion={filtros.gestion ?? currentYear} loading={loading} onBarClick={handleBarClick} />
        </div>

        {/* Two Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GraficoPorTipo data={porTipo} gestion={filtros.gestion ?? currentYear} loading={loading} onSectorClick={handleTipoClick} />
          <GraficoBarrasComunas data={porComuna} gestion={filtros.gestion ?? currentYear} loading={loading} onBarClick={handleComunaClick} />
        </div>

        {/* Evolution Chart */}
        <div>
          <GraficoEvolucion data={evolucionAnual} loading={loading} />
        </div>
      </div>
    </Sidebar>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute roles={["admin", "supervisor"] as UserRole[]}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
