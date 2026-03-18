export type Periodo = 'dia' | 'semana' | 'mes' | 'gestion'

export interface RendimientoParams {
  periodo: Periodo
  fecha?: string
  gestion?: number
  unidad?: string
  comuna?: string
  dias_vencimiento?: number
}

export interface RendimientoResumen {
  periodo: Periodo
  fecha_desde: string
  fecha_hasta: string
  total_despachados: number
  total_pendientes: number
  total_vencidos: number
  total_funcionarios: number
}

export interface FuncionarioRendimiento {
  nombre_funcionario: string
  unidad: string
  comuna: string
  despachados: number
  pendientes: number
  vencidos: number
}

export interface FuncionarioRanking extends FuncionarioRendimiento {
  posicion: number
  tasa_despacho: number
}

export interface TramitePendiente {
  id_tramite: number
  nro_tramite: number
  gestion: number
  nombre_funcionario: string
  unidad: string
  comuna: string
  tipo_tramite: string
  solicitante: string
  fecha_ingreso: string | null
  dias_en_espera: number
  es_vencido: boolean
}

export interface RendimientoFiltrosDisponibles {
  unidades: string[]
  comunas: string[]
}

export interface CacheStats {
  claves_en_cache: number
  claves: string[]
}
