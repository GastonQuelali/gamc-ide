import { useState } from "react"
import { Image, ChevronDown, ChevronUp, Layers } from "lucide-react"
import type { CapaGis } from "@/types/mapa.types"

interface BasemapSelectorProps {
  capasImagenes: CapaGis[]
  basemapActual: number | null
  onBasemapChange: (capaId: number | null) => void
}

export function BasemapSelector({ capasImagenes, basemapActual, onBasemapChange }: BasemapSelectorProps) {
  const [expanded, setExpanded] = useState(true)

  if (capasImagenes.length === 0) return null

  const getNombreDisplay = (capa: CapaGis) => {
    return capa.nombre_amigable || capa.nombre_tecnico_servicio.split("/").pop() || "Imagen"
  }

  return (
    <div className="bg-card border rounded-lg shadow-lg w-64">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Basemap</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t">
          <button
            onClick={() => onBasemapChange(null)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
              basemapActual === null ? "bg-primary/10 text-primary font-medium" : ""
            }`}
          >
            Sin imagen
          </button>
          {capasImagenes.map((capa) => (
            <button
              key={capa.id_relacion}
              onClick={() => onBasemapChange(capa.id_relacion)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
                basemapActual === capa.id_relacion ? "bg-primary/10 text-primary font-medium" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{getNombreDisplay(capa)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
