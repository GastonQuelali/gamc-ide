import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import type { Tramite } from "@/types/tramites"

interface GraficoComunasTramitesProps {
  tramites: Tramite[]
  onComunaClick: (comuna: string) => void
}

const COLORES = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
]

export function GraficoComunasTramites({ tramites, onComunaClick }: GraficoComunasTramitesProps) {
  const distribucion = useMemo(() => {
    const map = new Map<string, number>()
    tramites.forEach((t) => {
      const comuna = t.comuna || "Sin comuna"
      map.set(comuna, (map.get(comuna) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([comuna, total]) => ({ comuna, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7)
  }, [tramites])

  const dataConColores = distribucion.map((item, index) => ({
    ...item,
    fill: COLORES[index % COLORES.length],
  }))

  if (distribucion.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
        Sin datos
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={dataConColores} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
        <YAxis
          dataKey="comuna"
          type="category"
          tick={{ fontSize: 10 }}
          width={100}
          className="fill-muted-foreground"
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString("es-BO")} trámites`, "Total"]}
        />
        <Bar
          dataKey="total"
          radius={[0, 4, 4, 0]}
          onClick={(_, index) => {
            if (index !== undefined && dataConColores[index]) {
              const comuna = dataConColores[index].comuna
              if (comuna !== "Sin comuna") {
                onComunaClick(comuna)
              }
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {dataConColores.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="total"
            position="right"
            formatter={(value: unknown) => Number(value).toLocaleString("es-BO")}
            className="fill-foreground text-xs"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
