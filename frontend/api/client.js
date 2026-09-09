/**
 * Axios Client with Interceptors
 * Handles JWT token attachment, refresh, and error handling
 */

import axios from 'axios';
import store from '../app/store';
import { logout } from '../src/features/auth/store/authSlice';
import { tokenManager } from '../src/utils/auth/tokenManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds JWT token and sessionId to requests
 */
client.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    const sessionId = tokenManager.getSessionId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles 401 errors with token refresh
 * Redirects to login on permanent failure
 */
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const newToken = response.data.token;
          tokenManager.setAccessToken(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        tokenManager.clearTokens();
        store.dispatch(logout());
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      return Promise.reject({
        message: 'You do not have permission to access this resource',
        status: 403,
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }

    // Handle other server errors
    return Promise.reject(error);
  }
);

export default client;

