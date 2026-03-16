import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPITasaConclusion } from "@/types/kpi"

interface GraficoTasaConclusionProps {
  data: KPITasaConclusion[]
  gestion: number
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    const item = payload[0]
    const data = item?.dataKey === "tasa_pct" ? payload[0] : null
    const total = payload.find(p => p.dataKey === "total")?.value ?? 0
    const concluidos = payload.find(p => p.dataKey === "concluidos")?.value ?? 0
    
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Total: {Number(total).toLocaleString("es-BO")} trámites
        </p>
        <p className="text-sm text-muted-foreground">
          Concluidos: {Number(concluidos).toLocaleString("es-BO")}
        </p>
        {data && (
          <p className="text-sm font-medium text-primary">
            Tasa: {Number(data.value).toFixed(1)}%
          </p>
        )}
      </div>
    )
  }
  return null
}

export function GraficoTasaConclusion({ data, gestion, loading }: GraficoTasaConclusionProps) {
  const dataFiltrada = useMemo(() => {
    return data.filter((d) => d.total > 0)
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasa de conclusión — {gestion}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (dataFiltrada.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasa de conclusión — {gestion}</CardTitle>
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
        <CardTitle className="text-lg">Tasa de conclusión — {gestion}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataFiltrada} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="mes_nombre" 
              tick={{ fontSize: 12 }} 
              className="fill-muted-foreground"
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12 }} 
              className="fill-muted-foreground"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="5 5" label={{ value: "Meta 75%", position: "insideTopRight", fill: "#F59E0B", fontSize: 11 }} />
            <Line 
              type="monotone" 
              dataKey="tasa_pct" 
              name="Tasa %"
              stroke="#10B981" 
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props
                const isAboveTarget = payload.tasa_pct >= 75
                return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill={isAboveTarget ? "#10B981" : "#EF4444"} />
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
