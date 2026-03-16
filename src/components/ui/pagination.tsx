import { Button } from "./button"
import { Select } from "./select"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
  itemsPerPage: number
  itemsPerPageOptions?: number[]
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
  label?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  itemsPerPageOptions = [5, 10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  label = "elementos"
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers: (number | string)[] = []
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    pageNumbers.push(1)
    
    if (currentPage > 3) {
      pageNumbers.push("...")
    }
    
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }
    
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...")
    }
    
    pageNumbers.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => onItemsPerPageChange(Number(v))}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={String(option)}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        {pageNumbers.map((page, idx) =>
          typeof page === "number" ? (
            <Button
              key={idx}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              className="w-8"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={idx} className="px-1 text-muted-foreground">...</span>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
