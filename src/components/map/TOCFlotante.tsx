import { useState } from "react"
import { Layers, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useMapContext } from "@/context/MapContext"
import type { CapaGis } from "@/types/mapa.types"

interface TOCFlotanteProps {
  capas: CapaGis[]
}

export function TOCFlotante({ capas }: TOCFlotanteProps) {
  const [expanded, setExpanded] = useState(true)
  const [expandedCapas, setExpandedCapas] = useState<Set<number>>(new Set())
  const { capas: capasMap, setVisibilidad, setOpacidad } = useMapContext()

  const toggleCapaExpanded = (id: number) => {
    setExpandedCapas(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (capas.length === 0) return null

  return (
    <div className="bg-card border rounded-lg shadow-lg w-64">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Capas</span>
          <span className="text-xs text-muted-foreground">({capas.length})</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t max-h-48 overflow-y-auto">
          {capas.map((capa) => {
            const layer = capasMap.get(capa.id_relacion)
            const isVisible = layer?.visible ?? false
            const isExpanded = expandedCapas.has(capa.id_relacion)
            
            return (
              <div key={capa.id_relacion} className="border-b last:border-b-0">
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors">
                  <button
                    onClick={() => toggleCapaExpanded(capa.id_relacion)}
                    className="p-0.5 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                  <Switch
                    checked={isVisible}
                    onCheckedChange={(checked) => setVisibilidad(capa.id_relacion, checked)}
                  />
                  <span className="flex-1 text-sm truncate">
                    {capa.nombre_en_mapa || capa.nombre_amigable || capa.nombre_tecnico_servicio.split("/").pop()}
                  </span>
                </div>
                
                {isExpanded && (
                  <div className="px-3 pb-2 pl-8">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-14">Opacidad</span>
                      <Slider
                        value={[layer?.opacity ?? 1]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={() => {}}
                        onValueCommit={([value]) => setOpacidad(capa.id_relacion, value)}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {Math.round((layer?.opacity ?? 1) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
