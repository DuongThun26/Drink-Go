import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAuth } from '@/store/slices/authSlice'
import { fetchCart } from '@/store/slices/cartSlice'
import { ROLES } from '@/constants/roles'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, role, loading, initialized, error } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (!initialized) {
      dispatch(initializeAuth())
    }
  }, [dispatch, initialized])

  useEffect(() => {
    if (initialized) {
      dispatch(fetchCart())
    }
  }, [dispatch, initialized, isAuthenticated])

  return {
    user,
    isAuthenticated,
    isAdmin: role === ROLES.ADMIN,
    isGuest: !isAuthenticated,
    role,
    loading,
    initialized,
    error,
  }
}
