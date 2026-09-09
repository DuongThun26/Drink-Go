import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { fetchAdminOrders } from '@/store/slices/adminSlice'
import { orderApi } from '@/api/orderApi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/formatters'
import { ORDER_STATUS, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants/orderStatus'

const STATUS_ACTIONS = {
  [ORDER_STATUS.PENDING]: { label: 'Confirm', action: 'confirm' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Preparing', action: 'preparing' },
  [ORDER_STATUS.PREPARING]: { label: 'Shipping', action: 'shipping' },
  [ORDER_STATUS.SHIPPING]: { label: 'Delivered', action: 'delivered' },
  [ORDER_STATUS.DELIVERED]: { label: 'Complete', action: 'completed' },
}

export default function AdminOrdersPage() {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.admin.orders)

  useEffect(() => {
    dispatch(fetchAdminOrders())
  }, [dispatch])

  const handleAction = async (order, action) => {
    const fn = {
      confirm: orderApi.confirmOrder,
      preparing: orderApi.preparingOrder,
      shipping: orderApi.shippingOrder,
      delivered: orderApi.deliveredOrder,
      completed: orderApi.completedOrder,
    }[action]
    try {
      await fn(order.id)
      toast.success('Order updated')
      dispatch(fetchAdminOrders())
    } catch (err) {
      toast.error(err.message || 'Failed to update order')
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Order Management</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const next = STATUS_ACTIONS[order.status]
          return (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold">{order.code || `#${order.id}`}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.receivename} · {order.receivephone}
                  </p>
                  <p className="mt-1 font-medium text-primary">
                    {formatCurrency(order.finalAmount || order.totalAmount)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={ORDER_STATUS_COLORS[order.status]}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </Badge>
                  {next && (
                    <Button size="sm" onClick={() => handleAction(order, next.action)}>
                      {next.label}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {orders.length === 0 && (
          <p className="text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
