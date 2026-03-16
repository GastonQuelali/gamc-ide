import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  titulo: string
  valor: number
  comparacion?: number
  icon: LucideIcon
  variant?: "default" | "warning" | "success"
  loading?: boolean
  onClick?: () => void
}

const formatNumber = (n: number): string => {
  return n.toLocaleString("es-BO")
}

export function KPICard({ titulo, valor, comparacion, icon: Icon, variant = "default", loading, onClick }: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
      case "success":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
      default:
        return "bg-muted"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "success":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-primary"
    }
  }

  const getTrendIcon = () => {
    if (comparacion === undefined || comparacion === 0) {
      return <Minus className="h-3 w-3" />
    }
    return comparacion > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (comparacion === undefined || comparacion === 0) {
      return "text-muted-foreground"
    }
    return comparacion > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  return (
    <Card className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}>
      <CardContent className="p-4" onClick={onClick}>
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-lg", getVariantStyles())}>
            <Icon className={cn("h-6 w-6", getIconStyles())} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{titulo}</p>
            <p className="text-2xl font-bold">{formatNumber(valor)}</p>
            {comparacion !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>{formatNumber(Math.abs(comparacion))}</span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
