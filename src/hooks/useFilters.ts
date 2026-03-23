import { useState, useMemo, useCallback } from "react"

export type FilterValue = string | number | boolean | null

export interface FilterConfig {
  key: string
  type: "search" | "select" | "multiSelect" | "boolean" | "range"
  label?: string
  placeholder?: string
  options?: { value: string; label: string }[]
  field?: string
}

export interface UseFiltersOptions<T> {
  data: T[]
  filters: FilterConfig[]
  initialValues?: Record<string, FilterValue>
  onFilterChange?: (filteredData: T[]) => void
}

export interface UseFiltersReturn<T> {
  filterValues: Record<string, FilterValue>
  setFilter: (key: string, value: FilterValue) => void
  resetFilters: () => void
  resetFilter: (key: string) => void
  filteredData: T[]
  activeFilterCount: number
}

export function useFilters<T>({
  data,
  filters,
  initialValues = {},
}: UseFiltersOptions<T>): UseFiltersReturn<T> {
  const defaultValues = filters.reduce((acc, filter) => {
    acc[filter.key] = initialValues[filter.key] ?? (filter.type === "search" ? "" : "all")
    return acc
  }, {} as Record<string, FilterValue>)

  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>(defaultValues)

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilterValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilter = useCallback((key: string) => {
    const filter = filters.find(f => f.key === key)
    const defaultValue = filter?.type === "search" ? "" : "all"
    setFilterValues(prev => ({ ...prev, [key]: defaultValue }))
  }, [filters])

  const resetFilters = useCallback(() => {
    setFilterValues(defaultValues)
  }, [defaultValues])

  const filteredData = useMemo(() => {
    let result = data

    for (const filter of filters) {
      const value = filterValues[filter.key]
      
      if (value === "all" || value === "" || value === null || value === undefined) {
        continue
      }

      const fieldName = filter.field || filter.key

      if (filter.type === "search") {
        const searchLower = String(value).toLowerCase()
        result = result.filter(item => {
          const fieldValue = (item as Record<string, unknown>)[fieldName]
          if (fieldValue === null || fieldValue === undefined) return false
          return String(fieldValue).toLowerCase().includes(searchLower)
        })
      }

      if (filter.type === "select") {
        result = result.filter(item => {
          const fieldValue = (item as Record<string, unknown>)[fieldName]
          return fieldValue === value
        })
      }

      if (filter.type === "boolean") {
        result = result.filter(item => {
          const fieldValue = (item as Record<string, unknown>)[fieldName]
          return Boolean(fieldValue) === Boolean(value)
        })
      }
    }

    return result
  }, [data, filterValues, filters])

  const activeFilterCount = useMemo(() => {
    return filters.filter(filter => {
      const value = filterValues[filter.key]
      return value !== "all" && value !== "" && value !== null && value !== undefined
    }).length
  }, [filterValues, filters])

  return {
    filterValues,
    setFilter,
    resetFilters,
    resetFilter,
    filteredData,
    activeFilterCount
  }
}
