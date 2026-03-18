import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { rendimientoApi } from "@/lib/rendimientoApi"
import type { CacheStats } from "@/types/rendimiento"

interface PanelCacheRendimientoProps {
  isAdmin: boolean
  onInvalidar: () => Promise<void>
}

export function PanelCacheRendimiento({ isAdmin, onInvalidar }: PanelCacheRendimientoProps) {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAdmin) return

    const fetchStats = async () => {
      try {
        const stats = await rendimientoApi.getCacheStats()
        setCacheStats(stats)
      } catch (err) {
        console.error("Error fetching cache stats:", err)
      }
    }

    fetchStats()
  }, [isAdmin])

  const handleInvalidar = async () => {
    setLoading(true)
    try {
      await onInvalidar()
      const stats = await rendimientoApi.getCacheStats()
      setCacheStats(stats)
    } catch (err) {
      console.error("Error invalidando cache:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) return null

  return (
    <details className="mt-6 text-sm text-muted-foreground">
      <summary className="cursor-pointer font-medium">▸ Caché Redis — Rendimiento</summary>
      <div className="mt-2 flex items-center gap-4">
        <span>
          Claves en caché: <strong>{cacheStats?.claves_en_cache ?? "—"}</strong>
        </span>
        <Button variant="link" size="sm" className="text-red-500 h-auto p-0" onClick={handleInvalidar} disabled={loading}>
          {loading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
          Invalidar caché
        </Button>
      </div>
    </details>
  )
}
