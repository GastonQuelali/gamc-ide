import { useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Tramite } from "@/types/tramites"

interface GraficoTiposTramitesProps {
  tramites: Tramite[]
  onTipoClick: (tipo: string) => void
}

const COLORES = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
]

const truncateText = (text: string, maxLength: number = 30): string => {
  const cleaned = text.replace(/\r\n/g, " ").trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.slice(0, maxLength - 3) + "..."
}

export function GraficoTiposTramites({ tramites, onTipoClick }: GraficoTiposTramitesProps) {
  const distribucion = useMemo(() => {
    const map = new Map<string, number>()
    tramites.forEach((t) => {
      const tipo = t.tramitetipo || "Sin tipo"
      map.set(tipo, (map.get(tipo) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([tipo, total]) => ({ tipo, total }))
      .sort((a, b) => b.total - a.total)
  }, [tramites])

  if (distribucion.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
        Sin datos
      </div>
    )
  }

  const totalGeneral = distribucion.reduce((sum, d) => sum + d.total, 0)
  const dataTop5 = distribucion.slice(0, 5)
  const totalTop5 = dataTop5.reduce((sum, d) => sum + d.total, 0)

  const chartData = dataTop5.map((item, index) => ({
    name: truncateText(item.tipo, 35),
    value: item.total,
    percent: totalGeneral > 0 ? item.total / totalGeneral : 0,
    color: COLORES[index % COLORES.length],
    originalTipo: item.tipo,
  }))

  if (distribucion.length > 5) {
    const otros = totalGeneral - totalTop5
    chartData.push({
      name: "Otros",
      value: otros,
      percent: totalGeneral > 0 ? otros / totalGeneral : 0,
      color: "#9CA3AF",
      originalTipo: "Otros",
    })
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          onClick={(_, index) => {
            if (chartData[index]?.originalTipo && chartData[index].originalTipo !== "Otros") {
              onTipoClick(chartData[index].originalTipo)
            }
          }}
          style={{ cursor: "pointer" }}
          label={({ percent = 0 }) => (percent * 100).toFixed(1) + "%"}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [
            `${Number(value).toLocaleString("es-BO")} trámites`,
            String(name),
          ]}
        />
        <Legend
          formatter={(value) => <span className="text-xs">{truncateText(value, 20)}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
