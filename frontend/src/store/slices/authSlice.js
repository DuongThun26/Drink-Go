import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@/api/authApi'
import { tokenManager } from '@/utils/auth/tokenManager'
import { getUserFromToken, isTokenExpired } from '@/utils/jwt'
import { ROLES } from '@/constants/roles'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      tokenManager.setRememberMe(rememberMe)
      const response = await authApi.login({ username, password })
      tokenManager.setAccessToken(response.accessToken, rememberMe)
      tokenManager.setRefreshToken(response.refreshToken, rememberMe)
      return { ...response, user: getUserFromToken(response.accessToken) }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.register(data)
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout()
  } catch {
    /* clear locally even if server fails */
  }
  tokenManager.clearTokens()
})

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  const token = tokenManager.getAccessToken()
  if (!token) return rejectWithValue('No token')

  if (isTokenExpired(token)) {
    const refreshToken = tokenManager.getRefreshToken()
    if (!refreshToken) {
      tokenManager.clearTokens()
      return rejectWithValue('Token expired')
    }
    try {
      const response = await authApi.refreshToken(refreshToken)
      tokenManager.setAccessToken(response.accessToken)
      if (response.refreshToken) {
        tokenManager.setRefreshToken(response.refreshToken)
      }
      return getUserFromToken(response.accessToken)
    } catch {
      tokenManager.clearTokens()
      return rejectWithValue('Refresh failed')
    }
  }

  return getUserFromToken(token)
})

const initialState = {
  user: null,
  isAuthenticated: false,
  role: ROLES.GUEST,
  loading: false,
  initialized: false,
  error: null,
}

function resolveRole(user) {
  if (!user) return ROLES.GUEST
  if (user.roles?.includes(ROLES.ADMIN)) return ROLES.ADMIN
  return ROLES.USER
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.role = ROLES.GUEST
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.role = resolveRole(action.payload.user)
        state.initialized = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.role = ROLES.GUEST
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.role = resolveRole(action.payload)
        state.initialized = true
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.role = ROLES.GUEST
        state.initialized = true
      })
  },
})

export const { clearAuthError, logout } = authSlice.actions
export default authSlice.reducer
