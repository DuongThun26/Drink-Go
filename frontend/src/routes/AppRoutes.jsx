import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { Skeleton } from '@/components/ui/skeleton'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const ProductsPage = lazy(() => import('@/features/product/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/features/product/pages/ProductDetailPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const CartPage = lazy(() => import('@/features/cart/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/features/checkout/pages/CheckoutPage'))
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const OrdersPage = lazy(() => import('@/features/order/pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/features/order/pages/OrderDetailPage'))
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'))
const AdminStatsPage = lazy(() => import('@/features/admin/pages/AdminStatsPage'))
const AdminProductsPage = lazy(() => import('@/features/admin/pages/AdminProductsPage'))
const AdminCategoriesPage = lazy(() => import('@/features/admin/pages/AdminCategoriesPage'))
const AdminToppingsPage = lazy(() => import('@/features/admin/pages/AdminToppingsPage'))
const AdminOrdersPage = lazy(() => import('@/features/admin/pages/AdminOrdersPage'))
const AdminPromotionsPage = lazy(() => import('@/features/admin/pages/AdminPromotionsPage'))
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'))

function PageLoader() {
  return (
    <div className="container mx-auto space-y-4 p-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="toppings" element={<AdminToppingsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
