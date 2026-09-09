import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export function useFilteredProducts() {
  const { items, filters, pagination } = useSelector((state) => state.product)

  const filtered = useMemo(() => {
    let result = [...items]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category)
    }

    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return result
  }, [items, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.pageSize))
  const paginated = filtered.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  )

  return { products: paginated, total: filtered.length, totalPages, filters, pagination }
}
