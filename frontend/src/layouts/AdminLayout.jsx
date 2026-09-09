import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Cherry,
  ShoppingBag,
  Tag,
  Users,
  BarChart3,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/stats', label: 'Statistics', icon: BarChart3 },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/toppings', label: 'Toppings', icon: Cherry },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/promotions', label: 'Promotions', icon: Tag },
  { to: '/admin/users', label: 'Users', icon: Users },
]

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Panel
          </p>
          {adminNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center border-b px-6 lg:hidden">
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            onChange={(e) => {
              if (e.target.value) window.location.href = e.target.value
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Admin navigation
            </option>
            {adminNav.map(({ to, label }) => (
              <option key={to} value={to}>
                {label}
              </option>
            ))}
          </select>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
