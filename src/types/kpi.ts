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

export interface KPITiempoResolucion {
  tipo: string
  total: number
  dias_promedio: number
  dias_minimo: number
  dias_maximo: number
}

export interface KPITasaConclusion {
  mes: number
  mes_nombre: string
  total: number
  concluidos: number
  tasa_pct: number
}

export interface KPIMoraItem {
  tipo: string
  total: number
  dias_espera: number
}

export interface KPIEnMora {
  anio: number
  dias_promedio_normal: number
  en_mora: number
  dias_espera_promedio: number
  dias_espera_maximo: number
  por_tipo: KPIMoraItem[]
}

export interface KPIFilters {
  gestion?: number
  limite?: number
  anios?: number
}

export type UserRole = 'admin' | 'supervisor' | 'inspector' | 'ciudadano'
