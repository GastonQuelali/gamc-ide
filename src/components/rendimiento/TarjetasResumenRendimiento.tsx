import { CheckCircle2, Clock, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import type { RendimientoResumen } from "@/types/rendimiento"

interface TarjetasResumenRendimientoProps {
  resumen: RendimientoResumen | null
  loading: boolean
}

const formatNum = (n: number): string => n.toLocaleString("es-BO")

export function TarjetasResumenRendimiento({ resumen, loading }: TarjetasResumenRendimientoProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const cards = [
    {
      titulo: "Despachados",
      valor: resumen?.total_despachados ?? 0,
      icono: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      titulo: "Pendientes",
      valor: resumen?.total_pendientes ?? 0,
      icono: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      titulo: "Vencidos",
      valor: resumen?.total_vencidos ?? 0,
      icono: AlertTriangle,
      color: (resumen?.total_vencidos ?? 0) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-400",
      bgColor: (resumen?.total_vencidos ?? 0) > 0 ? "bg-red-50 dark:bg-red-950 border border-red-200" : "bg-muted",
      destacado: (resumen?.total_vencidos ?? 0) > 0,
    },
    {
      titulo: "Funcionarios activos",
      valor: resumen?.total_funcionarios ?? 0,
      icono: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.titulo} className={card.destacado ? "border-red-300" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icono className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.titulo}</p>
                <p className="text-2xl font-bold">{formatNum(card.valor)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
