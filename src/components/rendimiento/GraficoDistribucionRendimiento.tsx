import { useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHART_COLORS_ARRAY } from "@/lib/colors"
import type { RendimientoResumen } from "@/types/rendimiento"

interface GraficoDistribucionRendimientoProps {
  resumen: RendimientoResumen | null
  loading: boolean
}

export function GraficoDistribucionRendimiento({ resumen, loading }: GraficoDistribucionRendimientoProps) {
  const chartData = useMemo(() => {
    if (!resumen) return []
    return [
      { name: "Despachados", value: resumen.total_despachados },
      { name: "Pendientes", value: resumen.total_pendientes },
      { name: "Vencidos", value: resumen.total_vencidos },
    ].filter((d) => d.value > 0)
  }, [resumen])

  const tasa = useMemo(() => {
    if (!resumen) return "0.0"
    const total = resumen.total_despachados + resumen.total_pendientes
    if (total === 0) return "0.0"
    return (resumen.total_despachados / total * 100).toFixed(1)
  }, [resumen])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución de trámites</CardTitle>
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
          <CardTitle className="text-lg">Distribución de trámites</CardTitle>
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
        <CardTitle className="text-lg">Distribución de trámites</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString("es-BO"), "Trámites"]}
            />
            <Legend />
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-2xl font-bold"
            >
              {tasa}%
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
            >
              Tasa despacho
            </text>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
