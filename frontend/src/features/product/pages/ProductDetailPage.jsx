import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { fetchProductById, clearSelectedProduct, fetchProducts } from '@/store/slices/productSlice'
import { addCartItem } from '@/store/slices/cartSlice'
import { toppingApi } from '@/api/toppingApi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selectedProduct: product, loading, error } = useSelector((state) => state.product)
  const allProducts = useSelector((state) => state.product.items)

  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedToppings, setSelectedToppings] = useState([])
  const [availableToppings, setAvailableToppings] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchProducts())
    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id])

  useEffect(() => {
    if (product?.variants?.length && !selectedVariant) {
      setSelectedVariant(product.variants[0])
    }
  }, [product, selectedVariant])

  useEffect(() => {
    setSelectedToppings([])
  }, [product?.id])

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const toppings = await toppingApi.getAll()
        setAvailableToppings(Array.isArray(toppings) ? toppings : [])
      } catch (err) {
        toast.error(err?.message || 'Failed to load toppings')
        setAvailableToppings([])
      }
    }
    fetchToppings()
  }, [])

  const related = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  const toggleTopping = (toppingId) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((t) => t !== toppingId) : [...prev, toppingId]
    )
  }

  const toppingsForSelection = product?.toppings?.length > 0 ? product.toppings : availableToppings

  const toppingTotal = toppingsForSelection
    .filter((t) => selectedToppings.includes(t.id))
    .reduce((sum, t) => sum + (t.price || 0), 0)

  const unitPrice = (selectedVariant?.price || 0) + toppingTotal
  const lineTotal = unitPrice * quantity

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error('Please select a size')
      return
    }
    setAdding(true)
    try {
      await dispatch(
        addCartItem({
          productVariantId: selectedVariant.id,
          quantity,
          toppings: selectedToppings,
        })
      ).unwrap()
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-4 w-64" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-destructive">{error || 'Product not found'}</p>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  const image = product.images?.[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
        className="mb-6"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border bg-muted">
          {image ? (
            <img src={image} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.category && <Badge variant="secondary">{product.category}</Badge>}
            </div>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
          </div>

          {product.variants?.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      'rounded-md border px-4 py-2 text-sm transition-colors',
                      selectedVariant?.id === variant.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:border-primary'
                    )}
                  >
                    {variant.size?.name} — {formatCurrency(variant.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {toppingsForSelection.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Toppings</h3>
              <div className="space-y-2">
                {toppingsForSelection.map((topping) => (
                  <label
                    key={topping.id}
                    className="flex cursor-pointer items-center justify-between rounded-md border p-3 hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping.id)}
                        onChange={() => toggleTopping(topping.id)}
                        className="rounded border-input"
                      />
                      {topping.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      +{formatCurrency(topping.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(lineTotal)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" loading={adding} onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">Related Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
