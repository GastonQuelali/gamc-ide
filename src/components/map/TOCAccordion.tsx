import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, Info, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useMapContext } from "@/context/MapContext"
import { agruparCapasPorGrupo } from "@/lib/layerFactory"
import type { CapaGis } from "@/types/mapa.types"
import type Layer from "@arcgis/core/layers/Layer"

interface CapaControlProps {
  capa: CapaGis
  layer: Layer
}

function CapaControl({ capa, layer }: CapaControlProps) {
  const [showInfo, setShowInfo] = useState(false)
  const { setVisibilidad } = useMapContext()

  return (
    <div className="border-b last:border-b-0 py-2 px-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={layer.visible}
          onCheckedChange={(checked) => setVisibilidad(capa.id_relacion, checked)}
          aria-label={`Visibilidad de ${capa.nombre_amigable}`}
        />
        <span className="flex-1 text-sm truncate">{capa.nombre_amigable}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {showInfo && capa.popup_config && (
        <div className="mt-2 pl-8 text-xs text-muted-foreground bg-muted p-2 rounded">
          <p className="font-medium mb-1">Información de Capa</p>
          <p><strong>Nombre técnico:</strong> {capa.nombre_tecnico_servicio}</p>
          <p><strong>Tipo:</strong> {capa.tipo}</p>
          <p><strong>URL:</strong> <code className="text-xs">{capa.url}</code></p>
          {capa.popup_config.title && <p><strong>Popup:</strong> {capa.popup_config.title}</p>}
        </div>
      )}
    </div>
  )
}

interface GrupoAccordionProps {
  grupo: string | null
  capas: CapaGis[]
}

function GrupoAccordion({ grupo, capas }: GrupoAccordionProps) {
  const [expanded, setExpanded] = useState(true)
  const { capas: capasMap } = useMapContext()

  return (
    <div className="border-b">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <Layers className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">
          {grupo || "Sin grupo"}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {capas.length} capa{capas.length !== 1 ? "s" : ""}
        </span>
      </button>

      {expanded && (
        <div>
          {capas.map((capa) => {
            const layer = capasMap.get(capa.id_relacion)
            if (!layer) return null
            return (
              <CapaControl
                key={capa.id_relacion}
                capa={capa}
                layer={layer}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

interface TOCAccordionProps {
  capas: CapaGis[]
}

export function TOCAccordion({ capas }: TOCAccordionProps) {
  const grupos = useMemo(() => agruparCapasPorGrupo(capas), [capas])

  if (capas.length === 0) {
    return (
      <div className="bg-card border-b py-4 px-3">
        <p className="text-sm text-muted-foreground text-center">
          No hay capas disponibles
        </p>
      </div>
    )
  }

  const gruposArray = Array.from(grupos.entries())

  return (
    <div className="bg-card border-b max-h-64 overflow-y-auto">
      <div className="sticky top-0 bg-card border-b px-3 py-2 z-10">
        <h3 className="text-sm font-semibold">Capas</h3>
      </div>
      {gruposArray.map(([grupo, capasDelGrupo]) => (
        <GrupoAccordion
          key={grupo || "sin-grupo"}
          grupo={grupo}
          capas={capasDelGrupo}
        />
      ))}
    </div>
  )
}
