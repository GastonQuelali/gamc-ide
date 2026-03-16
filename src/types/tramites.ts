export interface TramiteFiltros {
  gestion: number
  tipos: string[]
  comunas: string[]
  meses: number[]
}

export interface Tramite {
  idTramite: number
  nroTramite: number
  gestion: number
  tramitetipo: string | null
  tipotramite: string | null
  fechaIngreso: string | null
  fechaSalida: string | null
  nroFojas: number | null
  observacion: string | null
  solicitante: string | null
  docSolicitante: string | null
  propietario: string | null
  docPropietario: string | null
  comuna: string | null
  estado: 'en_tramite' | 'concluido'
}

export interface TramitesResponse {
  total: number
  pagina: number
  por_pagina: number
  paginas: number
  tramites: Tramite[]
}

export interface TramitesParams {
  gestion?: number
  mes?: number
  tipo?: string
  comuna?: string
  estado?: 'en_tramite' | 'concluido'
  q?: string
  pagina?: number
  por_pagina?: number
}
