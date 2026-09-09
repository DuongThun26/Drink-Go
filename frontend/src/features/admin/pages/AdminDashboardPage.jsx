import { Link } from 'react-router-dom'
import { Package, FolderTree, ShoppingBag, Tag, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const links = [
  { to: '/admin/stats', label: 'Statistics', icon: BarChart3, desc: 'View sales and order metrics' },
  { to: '/admin/products', label: 'Products', icon: Package, desc: 'Manage menu items' },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree, desc: 'Organize product categories' },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, desc: 'Process customer orders' },
  { to: '/admin/promotions', label: 'Promotions', icon: Tag, desc: 'Manage discount codes' },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Manage your DrinkGo store</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ to, label, icon: Icon, desc }) => (
          <Link key={to} to={to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
