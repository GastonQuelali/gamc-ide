import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginadorTramitesProps {
  pagina: number
  paginas: number
  total: number
  porPagina: number
  onPaginaChange: (pagina: number) => void
  onPorPaginaChange: (porPagina: number) => void
}

export function PaginadorTramites({
  pagina,
  paginas,
  total,
  porPagina,
  onPaginaChange,
  onPorPaginaChange,
}: PaginadorTramitesProps) {
  if (paginas <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Página {pagina} de {paginas} — {total.toLocaleString("es-BO")} registros
        </span>
        <select
          className="flex h-9 w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
          value={porPagina}
          onChange={(e) => onPorPaginaChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagina <= 1}
          onClick={() => onPaginaChange(pagina - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagina >= paginas}
          onClick={() => onPaginaChange(pagina + 1)}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
