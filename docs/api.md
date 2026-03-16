# Documentación de API

## Endpoints del Backend

### Autenticación

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "nombre": "gquelali",
  "clave": "temporal.1"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "usuario": {
    "persona_id": "...",
    "nombre": "Usuario",
    "apellido": "Apellido",
    "email": "email@domain.com",
    "rol": "admin"
  }
}
```

#### Obtener usuario actual
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Capas GIS

#### Listar todas las capas (Admin)
```http
GET /api/v1/capas/admin/capas
Authorization: Bearer <token>
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Predios CBA",
    "descripcion": "Capa de predios",
    "url_servicio": "http://192.168.105.219:6080/...",
    "tipo_servicio": "Feature Layer",
    "activa": true,
    "publica": true,
    "visible": true,
    "opacidad": 1.0,
    "orden": 1,
    "grupo": "Catastro",
    "thumbnail_url": null,
    "creado_en": "2024-01-15T10:00:00Z",
    "actualizado_en": "2024-01-15T10:00:00Z"
  }
]
```

#### Obtener capa por ID
```http
GET /api/v1/capas/admin/capas/{id}
Authorization: Bearer <token>
```

#### Actualizar capa
```http
PUT /api/v1/capas/admin/capas/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo nombre",
  "descripcion": "Nueva descripción",
  "activa": true,
  "publica": false,
  "visible": true,
  "opacidad": 0.8,
  "orden": 2,
  "grupo": "Nuevo grupo"
}
```

#### Capas disponibles en ArcGIS
```http
GET /api/v1/capas/admin/disponibles
Authorization: Bearer <token>
```

**Respuesta:**
```json
[
  {
    "nombre_servicio": "predios_cba",
    "tipo_servicio": "Feature Layer",
    "url": "http://192.168.105.219:6080/arcgis/rest/services/..."
  }
]
```

#### Importar capas
```http
POST /api/v1/capas/admin/importar
Authorization: Bearer <token>
```

#### Asignar roles a capa
```http
POST /api/v1/capas/admin/capas/{id}/roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "roles": ["admin", "tecnico"],
  "visible": true,
  "editable": false
}
```

#### Capas para visor (público)
```http
GET /api/v1/capas/visor
```

#### Capas públicas (sin auth)
```http
GET /api/v1/capas/visor/publicas
```

### Perfil

#### Obtener mi perfil
```http
GET /api/v1/perfil/
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "persona_id": "...",
  "nombre": "Usuario",
  "apellido": "Apellido",
  "email": "email@domain.com",
  "telefono": "+59170000000",
  "avatar_url": "https://...",
  "rol": "admin",
  "area": "Catastro"
}
```

#### Actualizar perfil
```http
PUT /api/v1/perfil/
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo nombre",
  "telefono": "+59170000000",
  "idioma": "es"
}
```

### Catastro

#### Buscar predios
```http
GET /api/v1/catastro/predios/buscar?q=010101&limite=20
Authorization: Bearer <token>
```

#### Ficha de predio
```http
GET /api/v1/catastro/predios/{codigo_catastral}
Authorization: Bearer <token>
```

## Tipos de Datos

### CapaGIS
```typescript
interface CapaGIS {
  id: number;
  nombre: string;
  descripcion: string | null;
  url_servicio: string;
  tipo: string | null;
  tipo_servicio: string | null;
  nombre_servicio: string | null;
  activa: boolean;
  publica: boolean;
  visible: boolean;
  opacidad: number;
  orden: number;
  min_escala: number | null;
  max_escala: number | null;
  grupo: string | null;
  config: Record<string, unknown> | null;
  thumbnail_url: string | null;
  creado_en: string | null;
  actualizado_en: string | null;
}
```

### Usuario
```typescript
interface Usuario {
  persona_id: string;
  nombre: string;
  apellido: string | null;
  email: string | null;
  rol: string;
}
```

### Token Response
```typescript
interface TokenResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}
```

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 401 | No autorizado |
| 422 | Error de validación |
| 500 | Error del servidor |

## Autenticación

El frontend usa un proxy en Vite para evitar CORS:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

El token JWT se envía en el header:
```
Authorization: Bearer <token>
```

## Ejemplo de uso en el Frontend

```typescript
// src/lib/api.ts
const headers = (): HeadersInit => {
  const token = localStorage.getItem('gamc_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const capasApi = {
  getAll: async (): Promise<CapaGIS[]> => {
    const response = await fetch('/api/v1/capas/admin/capas', {
      headers: headers(),
    })
    return response.json()
  },
}
```
