import axios from 'axios'
import store from '@/app/store'
import { logout } from '@/store/slices/authSlice'
import { tokenManager } from '@/utils/auth/tokenManager'
import { getCookie, CART_GUEST_COOKIE } from '@/utils/cookies'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenManager.getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
          const { accessToken } = response.data
          tokenManager.setAccessToken(accessToken)
          if (response.data.refreshToken) {
            tokenManager.setRefreshToken(response.data.refreshToken)
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axiosClient(originalRequest)
        }
      } catch {
        tokenManager.clearTokens()
        store.dispatch(logout())
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }

    if (error.response?.status === 403) {
      return Promise.reject({
        message: 'You do not have permission to access this resource',
        status: 403,
      })
    }

    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      })
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'

    return Promise.reject({ ...error, message, status: error.response.status })
  }
)

export function getCartGuestHeader() {
  const cartGuest = getCookie(CART_GUEST_COOKIE)
  return cartGuest ? { 'Cart-Guest': cartGuest } : {}
}

export default axiosClient
