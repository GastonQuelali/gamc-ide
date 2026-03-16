import type { ReactNode } from "react"

interface Column<T> {
  key: string
  header: string
  render?: (item: T, index: number) => ReactNode
  className?: string
  width?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  emptyMessage?: string
  loading?: boolean
  loadingMessage?: string
  className?: string
}

export function Table<T>({
  data,
  columns,
  keyField,
  emptyMessage = "No hay datos",
  loading = false,
  loadingMessage = "Cargando...",
  className = ""
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2 text-muted-foreground">{loadingMessage}</span>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left p-3 font-medium ${column.className || ""}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={String(item[keyField])} className="border-b hover:bg-muted/50">
              {columns.map((column) => (
                <td key={column.key} className={`p-3 ${column.className || ""}`}>
                  {column.render
                    ? column.render(item, index)
                    : String((item as Record<string, unknown>)[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
