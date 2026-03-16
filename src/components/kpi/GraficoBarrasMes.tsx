import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPIPorMes } from "@/types/kpi"

interface GraficoBarrasMesProps {
  data: KPIPorMes[]
  gestion: number
  loading?: boolean
  onBarClick?: (data: KPIPorMes) => void
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value.toLocaleString("es-BO")} trámites
        </p>
      </div>
    )
  }
  return null
}

const renderLabel = (props: { x?: number; y?: number; width?: number; height?: number; value?: number }) => {
  const { x = 0, width = 0, y = 0, value } = props
  if (!value || value === 0) return null
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      textAnchor="middle"
      className="fill-foreground text-xs font-medium"
    >
      {value.toLocaleString("es-BO")}
    </text>
  )
}

export function GraficoBarrasMes({ data, gestion, loading, onBarClick }: GraficoBarrasMesProps) {
  const dataFiltrada = data.filter((d) => d.total > 0)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trámites por mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (dataFiltrada.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trámites por mes — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos para el período seleccionado
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trámites por mes — {gestion}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataFiltrada} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="mes_nombre" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              onClick={onBarClick ? (_, index) => onBarClick(dataFiltrada[index]) : undefined}
              style={{ cursor: onBarClick ? 'pointer' : undefined }}
            >
              <LabelList dataKey="total" content={renderLabel as any} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
