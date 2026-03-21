export interface TemaMapa {
  id: number
  nombre: string
  slug: string
  icono: string
  descripcion: string
  activo: boolean
}

export interface PopupConfig {
  title?: string
  content?: string
  fieldInfos?: Array<{
    fieldName: string
    label?: string
    format?: Record<string, unknown>
  }>
}

export interface CapaGis {
  id_relacion: number
  nombre_amigable: string
  nombre_tecnico_servicio: string
  url: string
  tipo: "dynamic" | "feature" | "tiled"
  grupo: string | null
  orden: number
  visible_inicial: boolean
  opacidad: number
  popup_config: PopupConfig
}

export interface MapaConfig {
  mapa_id: number
  nombre_mapa: string
  slug: string
  configuracion_global?: {
    center?: [number, number]
    zoom?: number
    geometryService?: string
  }
  capas: CapaGis[]
}

export interface MapaTema {
  id: number
  nombre: string
  slug: string
  icono: string
  descripcion: string
  activo: boolean
  capas_count?: number
}

export interface CapaAsignada {
  id: number
  capa_id: number
  nombre: string
  url_servicio: string
  tipo: string
  grupo: string | null
  orden: number
  visible: boolean
  opacidad: number
}

export interface AsignarCapasRequest {
  capas: Array<{
    capa_id: number
    orden: number
    visible: boolean
    opacidad: number
  }>
}
