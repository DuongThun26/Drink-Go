import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { fetchOrderById, cancelOrder, clearSelectedOrder } from '@/store/slices/orderSlice'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { formatCurrency } from '@/utils/formatters'
import { ORDER_STATUS, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants/orderStatus'

export default function OrderDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const order = useSelector((state) => state.order.selectedOrder)
  const loading = useSelector((state) => state.order.loading)

  useEffect(() => {
    dispatch(fetchOrderById(id))
    return () => dispatch(clearSelectedOrder())
  }, [dispatch, id])

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrder(id)).unwrap()
      toast.success('Order cancelled')
      dispatch(fetchOrderById(id))
    } catch (err) {
      toast.error(err || 'Cannot cancel this order')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-4 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Order not found</p>
        <Link to="/orders" className="mt-4 text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    )
  }

  const status = order.orderStatus || order.status
  const canCancel = status === ORDER_STATUS.PENDING || status === ORDER_STATUS.CONFIRMED

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/orders' },
          { label: order.code || `#${order.id}` },
        ]}
        className="mb-6"
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{order.code || `Order #${order.id}`}</h1>
        <Badge className={ORDER_STATUS_COLORS[status]}>
          {ORDER_STATUS_LABELS[status] || status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {order.receiveName || order.receivename}</p>
            <p><strong>Phone:</strong> {order.receivephone}</p>
            <p>
              <strong>Address:</strong>{' '}
              {[order.detailaddress, order.ward, order.district, order.province]
                .filter(Boolean)
                .join(', ')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            {order.orderItems?.length > 0 ? (
              <ul className="space-y-3">
                {order.orderItems.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{item.productName || `Item ${i + 1}`} × {item.quantity}</span>
                    <span>{formatCurrency(item.totalPrice || item.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No item details available</p>
            )}
            <div className="mt-4 flex justify-between border-t pt-4 font-bold">
              <span>Total</span>
              <span className="text-primary">
                {formatCurrency(order.finalAmount || order.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {canCancel && (
        <Button variant="destructive" className="mt-6" onClick={handleCancel}>
          Cancel Order
        </Button>
      )}
    </div>
  )
}
