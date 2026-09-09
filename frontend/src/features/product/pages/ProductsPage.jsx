import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search } from 'lucide-react'
import {
  fetchProducts,
  fetchCategories,
  setSearch,
  setCategoryFilter,
  setSortBy,
  setPage,
} from '@/store/slices/productSlice'
import { useFilteredProducts } from '@/hooks/useFilteredProducts'
import { ProductCard } from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/ProductGridSkeleton'
import { Input } from '@/components/ui/input'
import { SimpleSelect } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { products, total, totalPages, filters, pagination } = useFilteredProducts()
  const loading = useSelector((state) => state.product.loading)
  const categories = useSelector((state) => state.product.categories)
  const error = useSelector((state) => state.product.error)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Products' }]} className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">Our Menu</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drinks..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>
        <SimpleSelect
          value={filters.category}
          onChange={(v) => dispatch(setCategoryFilter(v))}
          options={categoryOptions}
          placeholder="Category"
          className="sm:w-48"
        />
        <SimpleSelect
          value={filters.sortBy}
          onChange={(v) => dispatch(setSortBy(v))}
          options={[
            { value: 'name', label: 'Name A-Z' },
            { value: 'name-desc', label: 'Name Z-A' },
          ]}
          className="sm:w-40"
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      )}

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No products found.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{total} products</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            className="mt-8"
            page={pagination.page}
            totalPages={totalPages}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </>
      )}
    </div>
  )
}
