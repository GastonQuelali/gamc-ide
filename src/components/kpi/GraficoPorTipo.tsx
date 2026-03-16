import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPIPorTipo } from "@/types/kpi"

interface GraficoPorTipoProps {
  data: KPIPorTipo[]
  gestion: number
  loading?: boolean
  onSectorClick?: (data: KPIPorTipo) => void
}

const COLORES = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
]

const truncateText = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percent?: number } }> }) => {
  if (active && payload && payload.length) {
    const total = payload[0].value
    const percent = ((total / payload[0].payload.percent!) * 100).toFixed(1)
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString("es-BO")} trámites ({percent}%)
        </p>
      </div>
    )
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderLegend = (props: any) => {
  const { payload } = props
  if (!payload) return null

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: { color: string; value: string }, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs truncate max-w-[120px]" title={entry.value}>
            {truncateText(entry.value, 20)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function GraficoPorTipo({ data, gestion, loading, onSectorClick }: GraficoPorTipoProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por tipo — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos para el período seleccionado
          </div>
        </CardContent>
      </Card>
    )
  }

  const dataTop5 = data.slice(0, 5)
  const totalGeneral = data.reduce((sum, item) => sum + item.total, 0)

  const chartData = dataTop5.map((item, index) => ({
    name: truncateText(item.tipo, 35),
    value: item.total,
    total: item.total,
    percent: totalGeneral > 0 ? item.total / totalGeneral : 0,
    color: COLORES[index % COLORES.length],
    tipo: item.tipo,
  }))

  if (data.length > 5) {
    const totalTop5 = dataTop5.reduce((sum, item) => sum + item.total, 0)
    const otros = totalGeneral - totalTop5
    chartData.push({
      name: "Otros",
      value: otros,
      total: otros,
      percent: totalGeneral > 0 ? otros / totalGeneral : 0,
      color: "#9CA3AF",
      tipo: "Otros",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribución por tipo — {gestion}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ percent }: { percent?: number }) => percent ? `${(percent * 100).toFixed(1)}%` : ''}
              labelLine={false}
              onClick={onSectorClick ? (_, index) => onSectorClick(chartData[index]) : undefined}
              style={{ cursor: onSectorClick ? 'pointer' : undefined }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
