import { useState, useMemo } from "react"

interface UsePaginationOptions {
  initialPage?: number
  initialItemsPerPage?: number
  itemsPerPageOptions?: number[]
}

interface UsePaginationReturn<T> {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  paginatedItems: T[]
  totalItems: number
  setPage: (page: number) => void
  setItemsPerPage: (count: number) => void
  nextPage: () => void
  prevPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  canGoNext: boolean
  canGoPrev: boolean
  resetPagination: () => void
  itemsPerPageOptions: number[]
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const {
    initialPage = 1,
    initialItemsPerPage = 50,
    itemsPerPageOptions = [5, 10, 20, 50, 100]
  } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginatedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  )

  const setPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)

  const resetPagination = () => {
    setCurrentPage(1)
  }

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedItems,
    totalItems,
    setPage,
    setItemsPerPage: (count: number) => {
      setItemsPerPage(count)
      setCurrentPage(1)
    },
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
    resetPagination,
    itemsPerPageOptions
  }
}
