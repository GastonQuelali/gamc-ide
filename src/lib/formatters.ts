export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "-"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return "-"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "-"
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return "-"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "-"

  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "Hace un momento"
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays < 7) return `Hace ${diffDays} días`
  return formatDate(d)
}

export const capitalize = (text: string): string => {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalizeWords = (text: string): string => {
  if (!text) return ""
  return text
    .split(" ")
    .map(word => capitalize(word))
    .join(" ")
}

export const formatNumber = (num: number, decimals = 0): string => {
  return num.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatBoolean = (value: boolean | null | undefined, trueText = "Sí", falseText = "No"): string => {
  if (value === null || value === undefined) return "-"
  return value ? trueText : falseText
}

export const formatOpacity = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "100%"
  return `${Math.round(value * 100)}%`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}

export const toTitleCase = (str: string): string => {
  if (!str) return ""
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}
