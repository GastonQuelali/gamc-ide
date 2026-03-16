export const FILTER_OPTIONS = {
  ESTADO: [
    { value: "all", label: "Todos" },
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "mantenimiento", label: "En revisión" },
  ],
  ACTIVA: [
    { value: "all", label: "Todas" },
    { value: "yes", label: "Sí" },
    { value: "no", label: "No" },
  ],
  PUBLICA: [
    { value: "all", label: "Todas" },
    { value: "yes", label: "Sí" },
    { value: "no", label: "No" },
  ],
  TIPO: [
    { value: "all", label: "Todos" },
    { value: "Feature Layer", label: "Feature Layer" },
    { value: "Map Image", label: "Map Image" },
    { value: "Tile Layer", label: "Tile Layer" },
  ],
  VISIBLE: [
    { value: "all", label: "Todas" },
    { value: "yes", label: "Sí" },
    { value: "no", label: "No" },
  ],
} as const

export const ESTADO_LABELS = {
  online: "Online",
  offline: "Offline",
  mantenimiento: "En revisión",
} as const

export const TIPO_COLORS: Record<string, string> = {
  "Feature Layer": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Map Image": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Tile Layer": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export const ESTADO_COLORS = {
  online: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  offline: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  mantenimiento: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
}

export const DEFAULT_TIPO_COLOR = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"

export const getTipoColor = (tipo: string | null): string => {
  if (!tipo) return DEFAULT_TIPO_COLOR
  return TIPO_COLORS[tipo] || DEFAULT_TIPO_COLOR
}

export const getEstadoColor = (estado: string): string => {
  return ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS] || DEFAULT_TIPO_COLOR
}
