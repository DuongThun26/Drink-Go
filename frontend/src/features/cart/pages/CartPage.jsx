import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Minus, Plus, Trash2, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  toggleSelectedCartItem,
  toggleSelectAllCartItems,
} from '@/store/slices/cartSlice'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { formatCurrency } from '@/utils/formatters'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice, selectedItemIds, loading } = useCart()
  const [expandedItems, setExpandedItems] = useState({})
  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id))
  const selectedTotal = selectedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
  const allSelected = items.length > 0 && selectedItemIds.length === items.length

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const handleQuantityChange = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta
    if (newQty < 1) return
    try {
      await dispatch(
        updateCartItem({
          id: item.id,
          item: {
            productVariantId: item.productVariantId,
            quantity: newQty,
            toppings: item.toppings?.map((t) => t.id) || [],
          },
        })
      ).unwrap()
      dispatch(fetchCart())
    } catch (err) {
      toast.error(err || 'Failed to update quantity')
    }
  }

  const handleToppingToggle = async (item, toppingId, isSelected) => {
    let updatedToppings = item.toppings?.map((t) => t.id) || []
    
    if (isSelected) {
      updatedToppings = updatedToppings.filter((id) => id !== toppingId)
    } else {
      updatedToppings.push(toppingId)
    }

    try {
      await dispatch(
        updateCartItem({
          id: item.id,
          item: {
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            toppings: updatedToppings,
          },
        })
      ).unwrap()
      dispatch(fetchCart())
      toast.success('Cart updated')
    } catch (err) {
      toast.error(err || 'Failed to update toppings')
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await dispatch(removeCartItem(itemId)).unwrap()
      dispatch(fetchCart())
      toast.success('Item removed')
    } catch (err) {
      toast.error(err || 'Failed to remove item')
    }
  }

  const handleProceedToCheckout = () => {
    if (selectedItemIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm')
      return
    }
    navigate('/checkout')
  }

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-4 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Cart' }]} className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Your cart is empty</p>
          <Link to="/products" className="mt-4">
            <Button>Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border bg-muted/30 p-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => dispatch(toggleSelectAllCartItems())}
                  className="rounded border-input"
                />
                <span className="font-medium">Chọn tất cả sản phẩm</span>
              </label>
            </div>

            {items.map((item) => (
              <Card
                key={item.id || item.productVariantId}
                className={selectedItemIds.includes(item.id) ? 'border-primary' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex flex-1 cursor-pointer items-start gap-3"
                      onClick={() => dispatch(toggleSelectedCartItem(item.id))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          dispatch(toggleSelectedCartItem(item.id))
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => dispatch(toggleSelectedCartItem(item.id))}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 rounded border-input"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-lg">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.variantSizeName} — {formatCurrency(item.variantPrice)}
                        </p>

                        {item.toppings?.length > 0 && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Toppings: {item.toppings.map((t) => t.name).join(', ')}
                          </p>
                        )}

                        <p className="mt-3 font-semibold text-primary">
                          {formatCurrency(item.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(item.id)}
                        className="gap-2"
                      >
                        {expandedItems[item.id] ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Toppings
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Edit Toppings
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {expandedItems[item.id] && item.availableToppings?.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="mb-3 font-semibold text-sm">Available Toppings</p>
                      <div className="space-y-2">
                        {item.availableToppings.map((topping) => {
                          const isSelected = item.toppings?.some((t) => t.id === topping.id)
                          return (
                            <label
                              key={topping.id}
                              className="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-muted/50"
                            >
                              <span className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToppingToggle(item, topping.id, isSelected)}
                                  className="rounded border-input"
                                />
                                {topping.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                +{formatCurrency(topping.price)}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                <span>Đã chọn</span>
                <span>{selectedItemIds.length}/{items.length} sản phẩm</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total selected</span>
                <span className="text-primary">{formatCurrency(selectedTotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                <span>Total cart</span>
                <span className="text-primary">{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </Button>
              <Link to="/products" className="w-full">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
