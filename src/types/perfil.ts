export interface Direccion {
  calle?: string
  barrio?: string
  ciudad?: string
  zona?: string
  referencia?: string
}

export interface Perfil {
  persona_id: string
  nombre: string
  apellido: string | null
  email: string | null
  telefono: string | null
  avatar_url: string | null
  fecha_nacimiento: string | null
  genero: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir' | null
  direccion: Direccion | null
  idioma: string
  notif_push: boolean
  notif_email: boolean
  notif_whatsapp: boolean
  notif_newsletter: boolean
  rol: string
  area: string | null
  ultimo_login: string | null
}

export interface PerfilUpdate {
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  fecha_nacimiento?: string
  genero?: string
  idioma?: string
  direccion?: Direccion
  notif_push?: boolean
  notif_email?: boolean
  notif_whatsapp?: boolean
  notif_newsletter?: boolean
}
