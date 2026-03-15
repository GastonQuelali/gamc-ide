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

export const capasApi = {
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
    const response = await fetch(`${API_BASE_URL}/capas/admin/disponibles`, {
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
    const response = await fetch(`${API_BASE_URL}/capas/admin/importar`, {
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
