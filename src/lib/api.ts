import type { TemaMapa, MapaConfig } from "@/types/mapa.types"

const API_BASE_URL = "/api/v1"

const getToken = (): string | null => {
  return localStorage.getItem("gamc_token")
}

export const setToken = (token: string) => {
  localStorage.setItem("gamc_token", token)
}

export const removeToken = () => {
  localStorage.removeItem("gamc_token")
}

const headers = (): HeadersInit => {
  const token = getToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export interface CapaGIS {
  id: number
  nombre: string
  descripcion: string | null
  url_servicio: string
  tipo: string | null
  tipo_servicio: string | null
  nombre_servicio: string | null
  activa: boolean
  publica: boolean
  visible: boolean
  opacity: number
  orden: number
  min_escala: number | null
  max_escala: number | null
  grupo: string | null
  config: Record<string, unknown> | null
  thumbnail_url: string | null
  creado_en: string | null
  actualizado_en: string | null
}

export interface CapaArcGIS {
  nombre_servicio: string
  tipo_servicio: string
  url: string
}

export interface LoginRequest {
  nombre: string
  clave: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  usuario: {
    persona_id: string
    nombre: string
    apellido: string | null
    email: string | null
    rol: string
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Login failed")
    }
    return response.json()
  },

  me: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to get user info")
    }
    return response.json()
  },
}

export interface CapaGISUpdate {
  nombre?: string | null
  descripcion?: string | null
  activa?: boolean | null
  publica?: boolean | null
  visible?: boolean | null
  opacidad?: number | null
  orden?: number | null
  min_escala?: number | null
  max_escala?: number | null
  grupo?: string | null
  config?: Record<string, unknown> | null
}

export interface AsignarRolesRequest {
  roles: string[]
  visible?: boolean
  editable?: boolean
}

// Admin capas API (Backoffice)
export const capasAdminApi = {
  getAll: async (): Promise<CapaGIS[]> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch capas")
    }
    return response.json()
  },

  getAvailable: async (): Promise<CapaArcGIS[]> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas/disponibles`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch available capas")
    }
    return response.json()
  },

  getById: async (id: number): Promise<CapaGIS> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas/${id}`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch capa")
    }
    return response.json()
  },

  update: async (id: number, data: CapaGISUpdate): Promise<CapaGIS> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update capa")
    }
    return response.json()
  },

  import: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas/importar`, {
      method: "POST",
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to import capas")
    }
  },

  assignRoles: async (capaId: number, data: AsignarRolesRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas/${capaId}/roles`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to assign roles")
    }
  },
}

// Visor capas API (Storefront - capas según rol del usuario)
export const capasVisorApi = {
  getPublicas: async (): Promise<CapaGIS[]> => {
    const response = await fetch(`${API_BASE_URL}/capas/`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch capas")
    }
    return response.json()
  },
}

// Alias para backwards compatibility
export const capasApi = capasAdminApi

export const catalogoApi = {
  getMapas: async (): Promise<TemaMapa[]> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/mapas`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch mapas")
    }
    return response.json()
  },

  getMapaConfig: async (slug: string): Promise<MapaConfig> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/mapa/${slug}`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch mapa config")
    }
    return response.json()
  },
}

export const mapasAdminApi = {
  getAll: async (): Promise<TemaMapa[]> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/mapas`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch mapas")
    }
    return response.json()
  },

  getBySlug: async (slug: string): Promise<MapaConfig> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/mapa/${slug}`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch mapa")
    }
    return response.json()
  },

  getCapasDisponibles: async (): Promise<CapaGIS[]> => {
    const response = await fetch(`${API_BASE_URL}/capas/admin/capas`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch capas disponibles")
    }
    return response.json()
  },

  getMapaDetalle: async (slug: string): Promise<MapaConfig> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/mapa/${slug}`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch mapa detalle")
    }
    return response.json()
  },

  asignarCapasAMapa: async (mapaId: number, capas: Array<{
    capa_id: number
    orden: number
    visible_inicial: boolean
    nombre_en_mapa?: string
  }>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/admin/mapas/${mapaId}/asignar-capas`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(capas),
    })
    if (!response.ok) {
      throw new Error("Failed to assign capas to mapa")
    }
  },

  create: async (data: Partial<TemaMapa>): Promise<TemaMapa> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/admin/mapas`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create mapa")
    }
    return response.json()
  },

  update: async (id: number, data: Partial<TemaMapa>): Promise<TemaMapa> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/admin/mapas/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update mapa")
    }
    return response.json()
  },

  toggleActivo: async (id: number, activo: boolean): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/catalogo/admin/mapas/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ activo }),
    })
    if (!response.ok) {
      throw new Error("Failed to toggle mapa")
    }
  },
}

export interface Usuario {
  id: string
  persona_id: string
  nombre: string
  apellido: string | null
  email: string | null
  rol: string
  activo: boolean
  ultimo_login: string | null
  creado_en: string | null
}

export interface UsuarioCreate {
  nombre: string
  clave: string
  rol: string
  email?: string
  activo?: boolean
}

export interface UsuarioUpdate {
  nombre?: string
  email?: string
  rol?: string
  activo?: boolean
  clave?: string
}

export const usuariosApi = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch usuarios")
    }
    return response.json()
  },

  getById: async (id: string): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios/${id}`, {
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch usuario")
    }
    return response.json()
  },

  create: async (data: UsuarioCreate): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create usuario")
    }
    return response.json()
  },

  update: async (id: string, data: UsuarioUpdate): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update usuario")
    }
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios/${id}`, {
      method: "DELETE",
      headers: headers(),
    })
    if (!response.ok) {
      throw new Error("Failed to delete usuario")
    }
  },

  toggleActivo: async (id: string, activo: boolean): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios/${id}/toggle`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ activo }),
    })
    if (!response.ok) {
      throw new Error("Failed to toggle usuario")
    }
  },
}
