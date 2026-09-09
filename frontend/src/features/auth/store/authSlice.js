/**
 * Authentication Redux Slice and Thunks
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi.js';
import { tokenManager } from '../../../utils/auth/tokenManager.js';

// ============= THUNKS =============

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.login({ email, password });
      tokenManager.setAccessToken(response.token);
      tokenManager.setRefreshToken(response.refreshToken);
      tokenManager.generateSessionId(); // Clear guest session
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.signup({ name, email, password });
      tokenManager.setAccessToken(response.token);
      tokenManager.setRefreshToken(response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Sign up failed. Please try again.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      tokenManager.clearTokens();
      return null;
    } catch (error) {
      tokenManager.clearTokens(); // Clear anyway
      return null;
    }
  }
);

export const verifyAuth = createAsyncThunk(
  'auth/verifyAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = tokenManager.getAccessToken();
      if (!token) {
        return rejectWithValue('No token found');
      }

      if (tokenManager.isTokenExpired(token)) {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken);
          tokenManager.setAccessToken(response.token);
          return response.user;
        }
        throw new Error('Token expired');
      }

      const response = await authApi.verify();
      return response;
    } catch (error) {
      tokenManager.clearTokens();
      return rejectWithValue('Auth verification failed');
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshAuthToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        return rejectWithValue('No refresh token');
      }

      const response = await authApi.refreshToken(refreshToken);
      tokenManager.setAccessToken(response.token);
      return response.token;
    } catch (error) {
      tokenManager.clearTokens();
      return rejectWithValue('Token refresh failed');
    }
  }
);

// ============= SLICE =============

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  sessionId: tokenManager.getSessionId() || null,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSessionId: (state) => {
      state.sessionId = tokenManager.generateSessionId();
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.initialized = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
      });

    // Verify Auth
    builder
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.initialized = true;
      });

    // Refresh Token
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setSessionId, logout } = authSlice.actions;
export default authSlice.reducer;

