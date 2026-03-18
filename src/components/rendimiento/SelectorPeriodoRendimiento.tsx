import { Download, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RendimientoParams, RendimientoFiltrosDisponibles, Periodo } from "@/types/rendimiento"

interface SelectorPeriodoRendimientoProps {
  params: RendimientoParams
  filtrosDisponibles: RendimientoFiltrosDisponibles | null
  onPeriodoChange: (periodo: Periodo) => void
  onFilterChange: (key: keyof RendimientoParams, value: string | number | undefined) => void
  onLimpiar: () => void
  onExportar: () => void
  exportando: boolean
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => currentYear - i)

const MESES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
]

export function SelectorPeriodoRendimiento({
  params,
  filtrosDisponibles,
  onPeriodoChange,
  onFilterChange,
  onLimpiar,
  onExportar,
  exportando,
}: SelectorPeriodoRendimientoProps) {
  const periodo = params.periodo

  const renderDateSelector = () => {
    if (periodo === "gestion") {
      return (
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={params.gestion || currentYear}
          onChange={(e) => onFilterChange("gestion", Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )
    }

    if (periodo === "mes") {
      const mesActual = params.fecha ? new Date(params.fecha).getMonth() + 1 : new Date().getMonth() + 1
      const anioActual = params.fecha ? new Date(params.fecha).getFullYear() : currentYear

      return (
        <div className="flex gap-2">
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={mesActual}
            onChange={(e) => {
              const date = new Date(anioActual, Number(e.target.value) - 1, 1)
              onFilterChange("fecha", date.toISOString().split("T")[0])
            }}
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={anioActual}
            onChange={(e) => {
              const date = new Date(Number(e.target.value), mesActual - 1, 1)
              onFilterChange("fecha", date.toISOString().split("T")[0])
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <input
        type="date"
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={params.fecha || new Date().toISOString().split("T")[0]}
        onChange={(e) => onFilterChange("fecha", e.target.value)}
      />
    )
  }

  const periodoLabel: Record<Periodo, string> = {
    dia: "Hoy",
    semana: "Esta semana",
    mes: "Este mes",
    gestion: "Gestión",
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex gap-1">
        {(["dia", "semana", "mes", "gestion"] as Periodo[]).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodoChange(p)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              periodo === p
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {periodoLabel[p]}
          </button>
        ))}
      </div>

      {renderDateSelector()}

      <select
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={params.unidad || ""}
        onChange={(e) => onFilterChange("unidad", e.target.value || undefined)}
      >
        <option value="">Todas las unidades</option>
        {filtrosDisponibles?.unidades.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <select
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={params.comuna || ""}
        onChange={(e) => onFilterChange("comuna", e.target.value || undefined)}
      >
        <option value="">Todas las comunas</option>
        {filtrosDisponibles?.comunas.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <Button variant="outline" size="sm" onClick={onLimpiar}>
        <X className="h-4 w-4 mr-1" />
        Limpiar
      </Button>

      <Button onClick={onExportar} disabled={exportando}>
        {exportando ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Exportar Excel
      </Button>
    </div>
  )
}
