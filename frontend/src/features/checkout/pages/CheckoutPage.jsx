import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createOrder } from '@/store/slices/orderSlice'
import { fetchCart, resetCart, updateCartItem } from '@/store/slices/cartSlice'
import { useCart } from '@/hooks/useCart'
import { promotionApi } from '@/api/promotionApi'
import { CheckoutSchema } from '@/utils/validationSchemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { formatCurrency } from '@/utils/formatters'
import { PAYMENT_METHODS } from '@/constants/orderStatus'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoValid, setPromoValid] = useState(null)
  const [validatingPromo, setValidatingPromo] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: { paymentMethod: 'COD' },
  })

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  useEffect(() => {
    if (items.length === 0) return
  }, [items])

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
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
      toast.success('Topping updated')
    } catch (err) {
      toast.error(err || 'Failed to update toppings')
    }
  }

  const validatePromo = async () => {
    if (!promoCode.trim()) return
    setValidatingPromo(true)
    try {
      const valid = await promotionApi.validate({ code: promoCode })
      setPromoValid(valid)
      toast[valid ? 'success' : 'error'](valid ? 'Promo code applied!' : 'Invalid promo code')
    } catch {
      setPromoValid(false)
      toast.error('Could not validate promo code')
    } finally {
      setValidatingPromo(false)
    }
  }

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    try {
      const order = await dispatch(createOrder(data)).unwrap()
      dispatch(resetCart())
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      toast.error(err || 'Failed to place order')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id || item.productVariantId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.variantSizeName} — {formatCurrency(item.variantPrice)} × {item.quantity}
                      </p>
                      
                      {item.toppings?.length > 0 && (
                        <p className="mt-2 text-sm text-green-600">
                          ✓ Toppings: {item.toppings.map((t) => t.name).join(', ')}
                        </p>
                      )}
                      
                      <p className="mt-2 font-semibold text-primary">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>

                    {item.availableToppings?.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(item.id)}
                        className="ml-4 gap-2"
                      >
                        {expandedItems[item.id] ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Edit
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {expandedItems[item.id] && item.availableToppings?.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="mb-3 font-semibold text-sm">Select Toppings</p>
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
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="receivename">Full name</Label>
                <Input id="receivename" {...register('receivename')} error={!!errors.receivename} />
                {errors.receivename && (
                  <p className="text-xs text-destructive">{errors.receivename.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivephone">Phone</Label>
                <Input id="receivephone" {...register('receivephone')} error={!!errors.receivephone} />
                {errors.receivephone && (
                  <p className="text-xs text-destructive">{errors.receivephone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input id="province" {...register('province')} error={!!errors.province} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" {...register('district')} error={!!errors.district} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Input id="ward" {...register('ward')} error={!!errors.ward} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="detailaddress">Address detail</Label>
                <Input id="detailaddress" {...register('detailaddress')} error={!!errors.detailaddress} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea id="note" {...register('note')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-muted/50"
                >
                  <input type="radio" value={value} {...register('paymentMethod')} />
                  <span>{label}</span>
                </label>
              ))}
              {errors.paymentMethod && (
                <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id || item.productVariantId} className="flex justify-between">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Promotion code</Label>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase())
                      setPromoValid(null)
                    }}
                    placeholder="Enter code"
                  />
                  <Button type="button" variant="outline" loading={validatingPromo} onClick={validatePromo}>
                    Apply
                  </Button>
                </div>
                {promoValid === true && (
                  <p className="text-xs text-green-600">Promo code is valid</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
