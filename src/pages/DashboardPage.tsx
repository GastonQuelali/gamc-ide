import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Calendar, Clock, CheckCircle, RefreshCw, AlertCircle, BarChart3, Timer, Users } from "lucide-react"
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
import { GraficoTasaConclusion } from "@/components/kpi/GraficoTasaConclusion"
import { GraficoTiempoResolucion } from "@/components/kpi/GraficoTiempoResolucion"
import { GraficoEnMora } from "@/components/kpi/GraficoEnMora"
import { TabRendimiento } from "@/components/dashboard/TabRendimiento"
import type { UserRole } from "@/types/kpi"
import type { KPIPorMes, KPIPorTipo, KPIPorComuna } from "@/types/kpi"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

type TabType = 'volumen' | 'eficiencia' | 'rendimiento'

function DashboardContent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('volumen')
  const {
    resumen,
    porMes,
    porTipo,
    porComuna,
    evolucionAnual,
    tiempoResolucion,
    tasaConclusion,
    enMora,
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

  const tasaConclusionPromedio = useMemo(() => {
    const mesesConDatos = tasaConclusion.filter(m => m.total > 0)
    if (mesesConDatos.length === 0) return 0
    const suma = mesesConDatos.reduce((acc, m) => acc + m.tasa_pct, 0)
    return suma / mesesConDatos.length
  }, [tasaConclusion])

  const tiempoResolucionPromedio = useMemo(() => {
    if (tiempoResolucion.length === 0) return 0
    const totalTramites = tiempoResolucion.reduce((acc, t) => acc + t.total, 0)
    if (totalTramites === 0) return 0
    const sumaDiasPonderada = tiempoResolucion.reduce((acc, t) => acc + (t.dias_promedio * t.total), 0)
    return Math.round(sumaDiasPonderada / totalTramites)
  }, [tiempoResolucion])

  const enMoraTotal = enMora?.en_mora ?? 0

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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('volumen')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'volumen'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Volumen
          </button>
          <button
            onClick={() => setActiveTab('eficiencia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'eficiencia'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Timer className="h-4 w-4" />
            Eficiencia Operativa
          </button>
          {(user?.role === 'admin' || user?.role === 'supervisor') && (
            <button
              onClick={() => setActiveTab('rendimiento')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'rendimiento'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Users className="h-4 w-4" />
              Rendimiento
            </button>
          )}
        </div>

        {activeTab === 'rendimiento' ? (
          <TabRendimiento />
        ) : activeTab === 'volumen' ? (
          <>
            {/* KPI Cards Volumen */}
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
          </>
        ) : (
          <>
            {/* KPI Cards Eficiencia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <KPICard
                titulo="Tasa de conclusión"
                valor={tasaConclusionPromedio}
                sufijo="%"
                icon={CheckCircle}
                variant={tasaConclusionPromedio >= 75 ? "success" : "warning"}
                loading={loading}
              />
              <KPICard
                titulo="Tiempo prom. resolución"
                valor={tiempoResolucionPromedio}
                sufijo=" días"
                icon={Timer}
                variant={tiempoResolucionPromedio <= 30 ? "success" : "warning"}
                loading={loading}
              />
              <KPICard
                titulo="En mora"
                valor={enMoraTotal}
                icon={Clock}
                variant="destructive"
                loading={loading}
                onClick={() => irATramites({ gestion: filtros.gestion, estado: "en_tramite" })}
              />
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              * Calculado al día de hoy
            </p>

            {/* Tasa de Conclusion Chart */}
            <div className="mb-6">
              <GraficoTasaConclusion data={tasaConclusion} gestion={filtros.gestion ?? currentYear} loading={loading} />
            </div>

            {/* Two Column Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <GraficoTiempoResolucion data={tiempoResolucion} gestion={filtros.gestion ?? currentYear} loading={loading} />
              <GraficoEnMora data={enMora} gestion={filtros.gestion ?? currentYear} loading={loading} />
            </div>
          </>
        )}
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
