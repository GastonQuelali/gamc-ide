import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHART_COLORS } from "@/lib/colors"
import { toTitleCase, truncateText } from "@/lib/formatters"
import type { FuncionarioRanking } from "@/types/rendimiento"

interface GraficoRankingRendimientoProps {
  data: FuncionarioRanking[]
  loading: boolean
  periodoLabel?: string
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: FuncionarioRanking }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
        <p className="font-medium text-sm">{toTitleCase(data.nombre_funcionario)}</p>
        <p className="text-xs text-muted-foreground mb-2">{data.unidad}</p>
        <div className="space-y-1 text-xs">
          <p>Despachados: <span className="font-medium text-green-600">{data.despachados}</span></p>
          <p>Pendientes: <span className="font-medium text-yellow-600">{data.pendientes}</span></p>
          <p>Vencidos: <span className="font-medium text-red-600">{data.vencidos}</span></p>
          <p>Tasa: <span className="font-medium">{data.tasa_despacho.toFixed(1)}%</span></p>
        </div>
      </div>
    )
  }
  return null
}

export function GraficoRankingRendimiento({ data, loading, periodoLabel = "" }: GraficoRankingRendimientoProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      nombre_display: truncateText(toTitleCase(item.nombre_funcionario), 25),
    }))
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 10 Funcionarios{periodoLabel ? ` — ${periodoLabel}` : ""}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 10 Funcionarios{periodoLabel ? ` — ${periodoLabel}` : ""}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top 10 Funcionarios{periodoLabel ? ` — ${periodoLabel}` : ""}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 150 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <YAxis
              dataKey="nombre_display"
              type="category"
              tick={{ fontSize: 10 }}
              width={145}
              className="fill-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="despachados" stackId="a" fill={CHART_COLORS.success} name="Despachados" />
            <Bar dataKey="pendientes" stackId="a" fill={CHART_COLORS.warning} name="Pendientes" />
            <Bar dataKey="vencidos" stackId="a" fill={CHART_COLORS.danger} name="Vencidos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
