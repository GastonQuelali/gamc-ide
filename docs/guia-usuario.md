# Guía de Usuario

## Introducción

GAMC-IDE es un sistema de información geográfica catastral que permite visualizar y gestionar datos espaciales del municipio de Cercado.

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge)
- Conexión a la red municipal
- Credenciales de acceso

## Primeros Pasos

### 1. Iniciar Sesión

1. Abra el navegador y acceda a la URL del sistema
2. Ingrese su nombre de usuario
3. Ingrese su contraseña
4. Haga clic en "Iniciar Sesión"

```credentials
Usuario: gquelali
Contraseña: temporal.1
```

### 2. Navegación

Una vez autenticado, verá el **Dashboard** con un menú lateral que incluye:

- Dashboard
- Mapa
- Capas
- Admin Capas
- Configuración

## Funcionalidades

### Dashboard

El dashboard muestra:

- **Indicadores**: Total de predios, manzanas, reportes, usuarios
- **Gráficos**:
  - Predios por mes (barras)
  - Uso de suelo (circular)
- **Tabla**: Predios recientes con código, propietario, área y estado

### Mapa

El visor de mapas incluye:

- **Capas base**: Predios, manzanas, vías, uso de suelo
- **Mapas históricos**: Imágenes aéreas de diferentes años
- **Herramientas**:
  - Medición de distancia
  - Medición de área
  - Limpiar mediciones
- **Widgets**:
  - Búsqueda de predios
  - Coordenadas
  - Home (volver a vista inicial)
  - Lista de capas

#### Capas Disponibles

| Capa | Tipo | Descripción |
|------|------|-------------|
| Predios CBA | Feature Layer | Linderos y predios |
| Manzana DB | Map Image | Manzana urbana |
| Vías Urbanas | Feature Layer | Red vial |
| Uso de Suelo | Map Image | Zonificación |

### Gestión de Capas

La página de capas permite:

- **Buscar**: Filtrar por nombre
- **Ver**: Vista de lista o grilla
- **Paginación**: 5, 10, 20, 50, 100 por página
- **Copiar URL**: Copiar enlace del servicio
- **Abrir**: Abrir en nueva pestaña

### Administración de Capas

Panel para administradores:

- **Importar**: Traer capas desde ArcGIS Server
- **Editar**: Modificar propiedades de capas
  - Nombre
  - Descripción
  - Grupo
  - Orden
  - Opacidad
  - Activa/Pública/Visible
- **Filtrar**: Por estado, activa, pública, tipo

#### Flujo de Importación

1. Haga clic en "Importar de ArcGIS"
2. Revise las capas disponibles
3. Confirme la importación
4. Las capas se crean como inactivas

#### Editar una Capa

1. Haga clic en el botón de ajustes (⚙️)
2. Modifique los campos deseados
3. Active o publique la capa
4. Guarde los cambios

### Configuración

Permite modificar:

- **Perfil**: Nombre, email, teléfono, cargo
- **Apariencia**:
  - Modo oscuro/claro
  - Idioma
- **Notificaciones**: Email, predios, reportes
- **Seguridad**: Cambiar contraseña

## Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Navegar | Click en menú |
| Copiar URL | Click en botón |

## Solución de Problemas

### No puedo iniciar sesión

- Verifique que el servidor backend esté ejecutándose
- Confirme sus credenciales
- Revise la conexión de red

### El mapa no carga

- Verifique que ArcGIS Server esté disponible
- Actualice la página
- Revise la consola del navegador

### No veo las capas

- Verifique que la capa esté activa
- Confirme que tiene permisos
- Revise el estado en Admin Capas

## Glosario

| Término | Definición |
|----------|-------------|
| Capa | Representación geográfica de datos |
| Feature Layer | Capa vectorial editable |
| Map Image | Capa raster |
| Tile Layer | Capa de teselas |
| Predio | Terreno con límites definidos |
| Manzana | Unidad urbana delimitada |
| Código Catastral | Identificador único de predio |

## Contacto

Para soporte técnico:

- Correo: soporte@gamc.gob.bo
- Teléfono: (591) 4-XXX-XXXX
