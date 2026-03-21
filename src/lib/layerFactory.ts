import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
import TileLayer from "@arcgis/core/layers/TileLayer"
import Layer from "@arcgis/core/layers/Layer"
import PopupTemplate from "@arcgis/core/PopupTemplate"
import type { CapaGis } from "@/types/mapa.types"

export function createCapaGis(capa: CapaGis): Layer | null {
  const baseProps = {
    id: String(capa.id_relacion),
    title: capa.nombre_amigable,
    visible: capa.visible_inicial,
    opacity: capa.opacidad,
  }

  const popupTemplate = crearPopupTemplate(capa.popup_config)

  switch (capa.tipo) {
    case "dynamic":
      return new MapImageLayer({
        url: capa.url,
        ...baseProps,
        ...(popupTemplate && { popupTemplate }),
      })

    case "feature":
      return new FeatureLayer({
        url: capa.url,
        ...baseProps,
        ...(popupTemplate && { popupTemplate }),
      })

    case "tiled":
      return new TileLayer({
        url: capa.url,
        ...baseProps,
      })

    default:
      console.warn(`Unknown layer tipo: ${capa.tipo} for capa ${capa.nombre_amigable}`)
      return null
  }
}

function crearPopupTemplate(config: CapaGis["popup_config"]): PopupTemplate | null {
  if (!config || (!config.title && !config.content)) {
    return null
  }

  return new PopupTemplate({
    title: config.title || "",
    content: config.content || "",
  })
}

export function sortCapasPorOrden(capas: CapaGis[]): CapaGis[] {
  return [...capas].sort((a, b) => a.orden - b.orden)
}

export function agruparCapasPorGrupo(capas: CapaGis[]): Map<string | null, CapaGis[]> {
  const grupos = new Map<string | null, CapaGis[]>()
  
  for (const capa of capas) {
    const grupo = capa.grupo
    if (!grupos.has(grupo)) {
      grupos.set(grupo, [])
    }
    grupos.get(grupo)!.push(capa)
  }
  
  return grupos
}
