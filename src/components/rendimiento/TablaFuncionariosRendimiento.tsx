import { useState, useMemo } from "react"
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkeletonTable } from "@/components/ui/skeleton-table"
import { toTitleCase } from "@/lib/formatters"
import type { FuncionarioRendimiento } from "@/types/rendimiento"

interface TablaFuncionariosRendimientoProps {
  data: FuncionarioRendimiento[]
  loading: boolean
}

type SortKey = "despachados" | "pendientes" | "vencidos" | "tasa"
type SortDirection = "asc" | "desc"

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return null
  return direction === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
}

export function TablaFuncionariosRendimiento({ data, loading }: TablaFuncionariosRendimientoProps) {
  const [sortKey, setSortKey] = useState<SortKey>("despachados")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const tasaA = a.despachados + a.pendientes > 0 ? a.despachados / (a.despachados + a.pendientes) * 100 : 0
      const tasaB = b.despachados + b.pendientes > 0 ? b.despachados / (b.despachados + b.pendientes) * 100 : 0

      let valA: number, valB: number

      switch (sortKey) {
        case "despachados":
          valA = a.despachados
          valB = b.despachados
          break
        case "pendientes":
          valA = a.pendientes
          valB = b.pendientes
          break
        case "vencidos":
          valA = a.vencidos
          valB = b.vencidos
          break
        case "tasa":
          valA = tasaA
          valB = tasaB
          break
        default:
          valA = a.despachados
          valB = b.despachados
      }

      return sortDirection === "asc" ? valA - valB : valB - valA
    })
  }, [data, sortKey, sortDirection])

  const calculateTasa = (item: FuncionarioRendimiento): number => {
    const total = item.despachados + item.pendientes
    return total > 0 ? Math.round(item.despachados / total * 1000) / 10 : 0
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Todos los Funcionarios</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonTable rows={8} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Todos los Funcionarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">#</th>
                <th className="text-left p-2 font-medium">Funcionario</th>
                <th className="text-left p-2 font-medium">Unidad</th>
                <th className="text-left p-2 font-medium">Comuna</th>
                <th
                  className="text-left p-2 font-medium cursor-pointer hover:text-primary"
                  onClick={() => handleSort("despachados")}
                >
                  <span className="flex items-center">
                    Despachados
                    <SortIcon active={sortKey === "despachados"} direction={sortDirection} />
                  </span>
                </th>
                <th
                  className="text-left p-2 font-medium cursor-pointer hover:text-primary"
                  onClick={() => handleSort("pendientes")}
                >
                  <span className="flex items-center">
                    Pendientes
                    <SortIcon active={sortKey === "pendientes"} direction={sortDirection} />
                  </span>
                </th>
                <th
                  className="text-left p-2 font-medium cursor-pointer hover:text-primary"
                  onClick={() => handleSort("vencidos")}
                >
                  <span className="flex items-center">
                    Vencidos
                    <SortIcon active={sortKey === "vencidos"} direction={sortDirection} />
                  </span>
                </th>
                <th
                  className="text-left p-2 font-medium cursor-pointer hover:text-primary"
                  onClick={() => handleSort("tasa")}
                >
                  <span className="flex items-center">
                    Tasa %
                    <SortIcon active={sortKey === "tasa"} direction={sortDirection} />
                  </span>
                </th>
                <th className="text-left p-2 font-medium">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const tasa = calculateTasa(item)
                return (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 font-medium">{toTitleCase(item.nombre_funcionario)}</td>
                    <td className="p-2 text-muted-foreground">{item.unidad}</td>
                    <td className="p-2 text-muted-foreground">{item.comuna}</td>
                    <td className="p-2 font-bold text-green-600">{item.despachados}</td>
                    <td className={`p-2 ${item.pendientes > 0 ? "text-yellow-600" : "text-muted-foreground"}`}>
                      {item.pendientes}
                    </td>
                    <td className="p-2">
                      {item.vencidos > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          {item.vencidos}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-2 font-medium">{tasa.toFixed(1)}%</td>
                    <td className="p-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${tasa}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
