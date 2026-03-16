import { useState, useEffect, useMemo, useRef } from "react"
import { X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { TramitesParams, TramiteFiltros } from "@/types/tramites"

interface FiltrosTramitesProps {
  filtros: TramitesParams
  filtrosDisponibles: TramiteFiltros | null
  onFilterChange: (filtros: TramitesParams) => void
  onLimpiar: () => void
}

const MESES = [
  { valor: 1, nombre: "Enero" },
  { valor: 2, nombre: "Febrero" },
  { valor: 3, nombre: "Marzo" },
  { valor: 4, nombre: "Abril" },
  { valor: 5, nombre: "Mayo" },
  { valor: 6, nombre: "Junio" },
  { valor: 7, nombre: "Julio" },
  { valor: 8, nombre: "Agosto" },
  { valor: 9, nombre: "Septiembre" },
  { valor: 10, nombre: "Octubre" },
  { valor: 11, nombre: "Noviembre" },
  { valor: 12, nombre: "Diciembre" },
]

export function FiltrosTramites({ filtros, filtrosDisponibles, onFilterChange, onLimpiar }: FiltrosTramitesProps) {
  const [searchTerm, setSearchTerm] = useState(filtros.q || "")
  const initialized = useRef(false)
  
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const years = useMemo(() => Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i), [currentYear])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }
    
    const timer = setTimeout(() => {
      const newQ = searchTerm || undefined
      if (newQ !== filtros.q) {
        onFilterChange({ q: newQ })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, filtros.q, onFilterChange])

  const handleChange = (key: keyof TramitesParams, value: string | undefined) => {
    if (key === "gestion") {
      onFilterChange({ gestion: value ? Number(value) : currentYear })
    } else if (key === "mes") {
      onFilterChange({ mes: value ? Number(value) : undefined })
    } else {
      onFilterChange({ [key]: value || undefined })
    }
  }

  const hasActiveFilters = filtros.mes || filtros.tipo || filtros.comuna || filtros.estado || filtros.q

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={filtros.gestion || currentYear}
          onChange={(e) => handleChange("gestion", e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={filtros.mes || ""}
          onChange={(e) => handleChange("mes", e.target.value)}
        >
          <option value="">Todos los meses</option>
          {filtrosDisponibles?.meses.map((mes) => (
            <option key={mes} value={mes}>
              {MESES.find((m) => m.valor === mes)?.nombre}
            </option>
          ))}
        </select>

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={filtros.tipo || ""}
          onChange={(e) => handleChange("tipo", e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {filtrosDisponibles?.tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.replace(/\r\n/g, " ").trim()}
            </option>
          ))}
        </select>

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={filtros.comuna || ""}
          onChange={(e) => handleChange("comuna", e.target.value)}
        >
          <option value="">Todas las comunas</option>
          {filtrosDisponibles?.comunas.map((comuna) => (
            <option key={comuna} value={comuna}>
              {comuna}
            </option>
          ))}
        </select>

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={filtros.estado || ""}
          onChange={(e) => handleChange("estado", e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="en_tramite">En trámite</option>
          <option value="concluido">Concluido</option>
        </select>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={onLimpiar} title="Limpiar filtros">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
