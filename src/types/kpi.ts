export interface KPIResumen {
  anio: number
  total_anio_actual: number
  total_anio_anterior: number
  variacion_anual_pct: number
  total_mes_actual: number
  total_mes_anterior: number
  en_tramite: number
  concluidos: number
}

export interface KPIPorMes {
  mes: number
  mes_nombre: string
  total: number
}

export interface KPIPorTipo {
  tipo: string
  total: number
}

export interface KPIPorComuna {
  comuna: string
  total: number
}

export interface KPIEvolucion {
  anio: number
  total: number
}

export interface KPIFilters {
  gestion?: number
  limite?: number
  anios?: number
}

export type UserRole = 'admin' | 'supervisor' | 'inspector' | 'ciudadano'
