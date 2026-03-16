# Arquitectura del Sistema GAMC-IDE

## Visión General

```mermaid
graph TB
    subgraph Frontend
        A[React + TypeScript + Vite]
        B[Tailwind CSS]
        C[ArcGIS Maps SDK]
        D[Recharts]
    end
    
    subgraph Backend
        E[FastAPI]
        F[PostgreSQL]
        G[Elasticsearch]
        H[ArcGIS Server]
        I[MinIO]
    end
    
    A --> E
    E --> F
    E --> G
    E --> H
    E --> I
```

## Arquitectura de Componentes

```mermaid
graph LR
    subgraph Páginas
        P1[AuthPage]
        P2[Dashboard]
        P3[MapPage]
        P4[CapasPage]
        P5[AdminCapas]
        P6[ConfigPage]
    end
    
    subgraph Componentes
        C1[Sidebar]
        C2[MapCatastro]
        C3[MeasurementTools]
    end
    
    subgraph Hooks
        H1[useAuth]
        H2[useTheme]
        H3[useMap]
    end
    
    subgraph Servicios
        S1[API Client]
    end
    
    P1 --> H1
    P2 --> H1
    P3 --> H3
    P3 --> C2
    P4 --> S1
    P5 --> S1
    P6 --> H1
    P6 --> H2
    
    P1 --> C1
    P2 --> C1
    P3 --> C1
    P4 --> C1
    P5 --> C1
    P6 --> C1
```

## Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as AuthPage
    participant H as AuthProvider
    participant API as Backend
    participant S as localStorage

    U->>A: Ingresa credenciales
    A->>H: login(username, password)
    H->>API: POST /api/v1/auth/login
    API->>H: JWT Token
    H->>S: Guarda token
    H->>A: Login exitoso
    A->>U: Redirige a Dashboard
```

## Estructura de Datos

```mermaid
erDiagram
    USUARIO {
        string persona_id PK
        string nombre
        string email
        string rol
    }
    
    CAPA {
        int id PK
        string nombre
        string url_servicio
        string tipo_servicio
        bool activa
        bool publica
        bool visible
        float opacidad
        int orden
    }
    
    PERFIL {
        string persona_id PK
        string nombre
        string email
        string telefono
        string avatar_url
    }
    
    USUARIO ||--|| PERFIL : tiene
```

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, TypeScript, Vite |
| Estilos | Tailwind CSS v4, shadcn/ui |
| Mapas | ArcGIS Maps SDK |
| Gráficos | Recharts |
| HTTP Client | Fetch API |
| Build | Vite |
| Linting | ESLint |

## Configuración de Proxy

```mermaid
flowchart LR
    subgraph Desarrollo
        B[Browser:5173]
        V[Vite Dev Server]
    end
    
    subgraph Backend
        API[FastAPI:8000]
        DB[(PostgreSQL)]
    end
    
    B --"/api/*"--> V
    V --"/api/*"--> API
    API --> DB
```

## Páginas del Sistema

```mermaid
stateDiagram-v2
    [*] --> Login
    Login --> Dashboard
    Dashboard --> Mapa
    Dashboard --> Capas
    Dashboard --> AdminCapas
    Dashboard --> Config
    Dashboard --> Logout
    Mapa --> Dashboard
    Capas --> Dashboard
    AdminCapas --> Dashboard
    Config --> Dashboard
    Logout --> Login
```

## Características Principales

### 1. Autenticación
- Login con usuario y contraseña
- Token JWT almacenado en localStorage
- Proxy para evitar CORS

### 2. Dashboard
- Indicadores visuales
- Gráficos de barras y pastel
- Tabla de predios recientes

### 3. Mapa
- Visor ArcGIS
- Capas de predios, manzanas, vías
- Herramientas de medición
- Galería de mapas históricos

### 4. Gestión de Capas
- Vista lista/grilla
- Filtros por estado, tipo
- Paginación configurable
- Copiar URL

### 5. Administración
- Importar capas de ArcGIS
- Editar propiedades
- Gestionar activa/pública/visible
