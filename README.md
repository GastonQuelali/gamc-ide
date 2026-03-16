# GAMC-IDE

Sistema de Información Geográfica Catastral para la Gobierno Autónomo Municipal de Cercado (Cochabamba, Bolivia).

## 🚀 Características

- **Autenticación**: Login con usuario y contraseña
- **Dashboard**: Indicadores, gráficos y tablas con datos estadísticos
- **Mapa Interactivo**: Visor de mapas catastrales con ArcGIS
- **Gestión de Capas**: Catálogo de capas GIS públicas
- **Administración de Capas**: Panel de admin para gestionar capas
- **Configuración**: Perfil de usuario y preferencias

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Mapas**: ArcGIS Maps SDK for JavaScript
- **Gráficos**: Recharts
- **Backend**: FastAPI (Python)

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── MapCatastro.tsx  # Componente del mapa
│   ├── MeasurementTools.tsx
│   └── Sidebar.tsx      # Navegación lateral
├── pages/                # Páginas de la aplicación
│   ├── AuthPage.tsx     # Login
│   ├── DashboardPage.tsx
│   ├── MapPage.tsx
│   ├── CapasPage.tsx
│   ├── AdminCapasPage.tsx
│   └── ConfigPage.tsx
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y API
├── config/               # Configuraciones
├── types/                # Tipos TypeScript
└── utils/                # Utilidades
```

## 📖 Documentación

- [Arquitectura](./docs/arquitectura.md)
- [API](./docs/api.md)
- [Componentes](./docs/componentes.md)
- [Guía de Uso](./docs/guia-usuario.md)

## 🏃‍♂️ Iniciar Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

## 🔧 Configuración

### Proxy de API

El proyecto usa un proxy en Vite para conectar con el backend:

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

## 📱 Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Login / Autenticación |
| `/dashboard` | Dashboard con estadísticas |
| `/map` | Visor de mapas |
| `/capas` | Catálogo de capas |
| `/admin/capas` | Administración de capas |
| `/config` | Configuración y perfil |

## 🏛️ GAMC

Gobierno Autónomo Municipal de Cercado - Cochabamba, Bolivia

## 📄 Licencia

Privado - GAMC
