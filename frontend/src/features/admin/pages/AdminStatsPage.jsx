import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Package, ShoppingBag, FolderTree, Tag } from 'lucide-react'
import {
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminCategories,
  fetchAdminPromotions,
} from '@/store/slices/adminSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ORDER_STATUS } from '@/constants/orderStatus'

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export default function AdminStatsPage() {
  const dispatch = useDispatch()
  const { orders, products, categories, promotions } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminOrders())
    dispatch(fetchAdminProducts())
    dispatch(fetchAdminCategories())
    dispatch(fetchAdminPromotions())
  }, [dispatch])

  const pendingOrders = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length
  const completedOrders = orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Statistics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={products.length} icon={Package} />
        <StatCard title="Categories" value={categories.length} icon={FolderTree} />
        <StatCard title="Pending Orders" value={pendingOrders} icon={ShoppingBag} />
        <StatCard title="Active Promotions" value={promotions.length} icon={Tag} />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Total orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
