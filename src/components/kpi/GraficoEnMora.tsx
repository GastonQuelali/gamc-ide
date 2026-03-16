import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPIEnMora, KPIMoraItem } from "@/types/kpi"

interface GraficoEnMoraProps {
  data: KPIEnMora | null
  gestion: number
  loading?: boolean
}

const truncateText = (text: string, maxLength: number = 35): string => {
  const cleaned = text.replace(/\r\n/g, " ").trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.slice(0, maxLength - 3) + "..."
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: KPIMoraItem }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
        <p className="font-medium text-sm">{data.tipo}</p>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>En mora: <span className="font-medium text-destructive">{data.total.toLocaleString("es-BO")}</span> trámites</p>
          <p>Días de espera: <span className="font-medium text-foreground">{data.dias_espera}</span> días</p>
        </div>
      </div>
    )
  }
  return null
}

export function GraficoEnMora({ data, gestion, loading }: GraficoEnMoraProps) {
  const dataOrdenada = useMemo(() => {
    if (!data?.por_tipo) return []
    return [...data.por_tipo]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trámites en mora por tipo — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!data || dataOrdenada.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trámites en mora por tipo — {gestion}</CardTitle>
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
        <CardTitle className="text-lg">Trámites en mora por tipo — {gestion}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Trámites con más de {data.dias_promedio_normal} días sin concluir
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataOrdenada} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            <Bar dataKey="total" fill="#EF4444" radius={[0, 4, 4, 0]} name="En mora">
              <LabelList 
                dataKey="total" 
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
