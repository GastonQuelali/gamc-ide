# Documentación de Componentes

## Componentes UI (shadcn/ui)

### Button
Botón interactivo con variantes.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Cargando...</Button>
```

### Input
Campo de texto.

```tsx
import { Input } from "@/components/ui/input"

<Input placeholder="Escribe aquí..." />
<Input type="email" />
<Input type="password" />
```

### Label
Etiqueta para formularios.

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Correo electrónico</Label>
<Input id="email" />
```

### Card
Contenedor con estilo de tarjeta.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### Select
Selector desplegable.

```tsx
import { Select } from "@/components/ui/select"

<Select onValueChange={(v) => setValue(v)}>
  <option value="1">Opción 1</option>
  <option value="2">Opción 2</option>
</Select>
```

### Switch
Interruptor depaleta.

```tsx
import { Switch } from "@/components/ui/switch"

<Switch checked={enabled} onCheckedChange={setEnabled} />
```

## Componentes Personalizados

### Sidebar

Navegación lateral con menú.

```tsx
import Sidebar from "@/components/Sidebar"

<Sidebar>
  <div>Contenido de la página</div>
</Sidebar>
```

**Props:**
- `children`: Contenido a renderizar

**Características:**
- Navegación entre páginas
- Toggle tema oscuro/claro
- Información del usuario
- Logout
- Expandido/colapsado

### MapCatastro

Componente del visor de mapas ArcGIS.

```tsx
import MapCatastro from "@/components/MapCatastro"

<MapCatastro height="100vh" />
```

**Props:**
- `height`: Altura del mapa

**Características:**
- Capas de predios, manzanas, vías
- Widgets de búsqueda
- Galería de mapas históricos
- Herramientas de medición
- LayerList con control de opacidad

### MeasurementTools

Barra de herramientas de medición.

```tsx
import MeasurementTools from "@/components/MeasurementTools"

<MeasurementTools onMeasure={setTool} />
```

**Props:**
- `onMeasure`: Función callback para tool seleccionada

## Páginas

### AuthPage

Página de autenticación.

```tsx
import AuthPage from "@/pages/AuthPage"

<Route path="/" element={<AuthPage />} />
```

**Características:**
- Formulario de login
- Validación de credenciales
- Proxy para API
- Mensajes de error

### DashboardPage

Dashboard con estadísticas y gráficos.

```tsx
import DashboardPage from "@/pages/DashboardPage"

<Route path="/dashboard" element={<DashboardPage />} />
```

**Características:**
- Tarjetas con indicadores
- Gráfico de barras (predios por mes)
- Gráfico circular (uso de suelo)
- Tabla de predios recientes

### MapPage

Página del visor de mapas.

```tsx
import MapPage from "@/pages/MapPage"

<Route path="/map" element={<MapPage />} />
```

### CapasPage

Catálogo de capas GIS.

```tsx
import CapasPage from "@/pages/CapasPage"

<Route path="/capas" element={<CapasPage />} />
```

**Características:**
- Vista lista/grilla
- Filtros (estado, tipo)
- Paginación configurable
- Copiar URL
- Columna correlativa

### AdminCapasPage

Administración de capas.

```tsx
import AdminCapasPage from "@/pages/AdminCapasPage"

<Route path="/admin/capas" element={<AdminCapasPage />} />
```

**Características:**
- Importar de ArcGIS
- Editar propiedades
- Filtros (estado, activa, pública, tipo)
- Modal de edición
- Estadísticas de capas

### ConfigPage

Configuración y perfil.

```tsx
import ConfigPage from "@/pages/ConfigPage"

<Route path="/config" element={<ConfigPage />} />
```

**Características:**
- Perfil de usuario
- Apariencia (tema, idioma)
- Notificaciones
- Seguridad

## Hooks Personalizados

### useAuth

Manejo de autenticación.

```tsx
import { useAuth } from "@/hooks/useAuth"

const { user, login, logout } = useAuth()
```

**Funciones:**
- `login(username, password)`: Autenticar usuario
- `logout()`: Cerrar sesión
- `user`: Usuario actual

### useTheme

Manejo de tema.

```tsx
import { useTheme } from "@/hooks/useTheme"

const { theme, toggleTheme } = useTheme()
```

**Funciones:**
- `theme`: 'light' | 'dark'
- `toggleTheme()`: Cambiar tema
- Persistencia en localStorage

### useMap

Inicialización del mapa ArcGIS.

```tsx
import { useMap } from "@/hooks/useMap"

const { mapDivRef, setMeasureTool } = useMap()
```

## Servicios

### API Client

Cliente para comunicación con backend.

```typescript
import { authApi, capasApi } from "@/lib/api"

// Auth
const response = await authApi.login({ nombre, clave })

// Capas
const capas = await capasApi.getAll()
const capa = await capasApi.getById(id)
await capasApi.update(id, data)
await capasApi.import()
```

## Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS v4 con variables CSS.

```css
/* src/index.css */
@theme {
  --color-primary: hsl(var(--primary));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
}
```

### CSS Modules

Alguns componentes usan CSS Modules.

```tsx
import "./MapCatastro.css"
```
