import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, initialized, loading } = useAuth()
  const location = useLocation()

  if (!initialized || loading) {
    return (
      <div className="container mx-auto space-y-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
