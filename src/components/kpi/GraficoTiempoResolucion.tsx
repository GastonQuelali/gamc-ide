import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPITiempoResolucion } from "@/types/kpi"

interface GraficoTiempoResolucionProps {
  data: KPITiempoResolucion[]
  gestion: number
  loading?: boolean
}

const truncateText = (text: string, maxLength: number = 35): string => {
  const cleaned = text.replace(/\r\n/g, " ").trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.slice(0, maxLength - 3) + "..."
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: KPITiempoResolucion }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
        <p className="font-medium text-sm">{data.tipo}</p>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Días promedio: <span className="font-medium text-foreground">{data.dias_promedio}</span></p>
          <p>Mínimo: <span className="font-medium text-foreground">{data.dias_minimo}</span> días</p>
          <p>Máximo: <span className="font-medium text-foreground">{data.dias_maximo}</span> días</p>
          <p>Total trámites: <span className="font-medium text-foreground">{data.total.toLocaleString("es-BO")}</span></p>
        </div>
      </div>
    )
  }
  return null
}

export function GraficoTiempoResolucion({ data, gestion, loading }: GraficoTiempoResolucionProps) {
  const dataOrdenada = useMemo(() => {
    return [...data]
      .sort((a, b) => b.dias_promedio - a.dias_promedio)
      .slice(0, 10)
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiempo promedio de resolución (días) — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (dataOrdenada.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiempo promedio de resolución (días) — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sin datos
          </div>
        </CardContent>
      </Card>
    )
  }

  const dataConColor = dataOrdenada.map((item) => ({
    ...item,
    fill: item.dias_promedio > 30 ? "#F59E0B" : "#10B981",
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tiempo promedio de resolución (días) — {gestion}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataConColor} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 11 }} 
              className="fill-muted-foreground"
            />
            <YAxis 
              dataKey="tipo"
              type="category"
              tick={{ fontSize: 10 }}
              width={200}
              className="fill-muted-foreground"
              tickFormatter={(value) => truncateText(value, 35)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="dias_promedio" radius={[0, 4, 4, 0]} name="Días promedio">
              {dataConColor.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList 
                dataKey="dias_promedio" 
                position="right" 
                className="fill-foreground text-xs"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
