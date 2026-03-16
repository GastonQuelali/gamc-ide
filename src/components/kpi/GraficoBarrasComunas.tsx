import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPIPorComuna } from "@/types/kpi"

interface GraficoBarrasComunasProps {
  data: KPIPorComuna[]
  gestion: number
  loading?: boolean
  onBarClick?: (data: KPIPorComuna) => void
}

const COLORES = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
]

const truncateText = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
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

export function GraficoBarrasComunas({ data, gestion, loading, onBarClick }: GraficoBarrasComunasProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top comunas</CardTitle>
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
          <CardTitle className="text-lg">Top comunas — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos para el período seleccionado
          </div>
        </CardContent>
      </Card>
    )
  }

  const dataFormateada = data.map((item, index) => ({
    nombre: truncateText(item.comuna),
    total: item.total,
    fill: COLORES[index % COLORES.length],
    original: item,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top comunas — {gestion}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataFormateada} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={120} className="fill-muted-foreground" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total" 
              radius={[0, 4, 4, 0]}
              onClick={onBarClick ? (_, index) => onBarClick(dataFormateada[index].original) : undefined}
              style={{ cursor: onBarClick ? 'pointer' : undefined }}
            >
              <LabelList dataKey="total" position="right" formatter={(value: unknown) => Number(value).toLocaleString("es-BO")} className="fill-foreground text-xs" />
              {dataFormateada.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
