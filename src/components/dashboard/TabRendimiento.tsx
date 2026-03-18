import { useAuth } from "@/hooks/useAuth"
import { useRendimiento } from "@/hooks/useRendimiento"
import { SelectorPeriodoRendimiento } from "@/components/rendimiento/SelectorPeriodoRendimiento"
import { TarjetasResumenRendimiento } from "@/components/rendimiento/TarjetasResumenRendimiento"
import { GraficoRankingRendimiento } from "@/components/rendimiento/GraficoRankingRendimiento"
import { GraficoDistribucionRendimiento } from "@/components/rendimiento/GraficoDistribucionRendimiento"
import { TablaFuncionariosRendimiento } from "@/components/rendimiento/TablaFuncionariosRendimiento"
import { TablaPendientesVencidos } from "@/components/rendimiento/TablaPendientesVencidos"
import { PanelCacheRendimiento } from "@/components/rendimiento/PanelCacheRendimiento"

export function TabRendimiento() {
  const { user } = useAuth()
  const {
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
    setPeriodo,
    setFiltro,
    limpiarFiltros,
    exportar,
    invalidarCache,
  } = useRendimiento()

  const isAdmin = user?.role === "admin"

  const periodoLabel = (() => {
    if (!resumen) return ""
    const fechaDesde = new Date(resumen.fecha_desde).toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit" })
    const fechaHasta = new Date(resumen.fecha_hasta).toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit" })
    return `${fechaDesde} — ${fechaHasta}`
  })()

  return (
    <>
      <SelectorPeriodoRendimiento
        params={params}
        filtrosDisponibles={filtrosDisponibles}
        onPeriodoChange={setPeriodo}
        onFilterChange={setFiltro}
        onLimpiar={limpiarFiltros}
        onExportar={exportar}
        exportando={exportando}
      />

      {resumen && (
        <p className="text-sm text-muted-foreground mb-4">
          Mostrando: {new Date(resumen.fecha_desde).toLocaleDateString("es-BO")} — {new Date(resumen.fecha_hasta).toLocaleDateString("es-BO")}
        </p>
      )}

      <TarjetasResumenRendimiento resumen={resumen} loading={loadingResumen} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GraficoRankingRendimiento data={ranking} loading={loadingFuncionarios} periodoLabel={periodoLabel} />
        <GraficoDistribucionRendimiento resumen={resumen} loading={loadingResumen} />
      </div>

      <TablaFuncionariosRendimiento data={porFuncionario} loading={loadingFuncionarios} />

      <div className="mt-6">
        <TablaPendientesVencidos data={pendientes} loading={loadingPendientes} />
      </div>

      <PanelCacheRendimiento isAdmin={isAdmin} onInvalidar={invalidarCache} />
    </>
  )
}
