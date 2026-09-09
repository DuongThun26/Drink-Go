import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '@/store/slices/orderSlice'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { formatCurrency } from '@/utils/formatters'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants/orderStatus'

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { items: orders, loading } = useSelector((state) => state.order)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )
  const groupedOrders = sortedOrders.reduce((groups, order) => {
    const date = order.createdAt ? new Date(order.createdAt) : null
    const dateKey = date ? date.toLocaleDateString('vi-VN') : 'Không rõ ngày'
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(order)
    return groups
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Orders' }]} className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedOrders).map(([dateKey, dayOrders]) => (
            <div key={dateKey} className="space-y-3">
              <h2 className="text-lg font-semibold">{dateKey}</h2>
              {dayOrders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{order.code || `Order #${order.id}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.receivename} · {order.receivephone}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={ORDER_STATUS_COLORS[order.status]}>
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </Badge>
                        <span className="font-bold text-primary">
                          {formatCurrency(order.finalAmount || order.totalAmount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
