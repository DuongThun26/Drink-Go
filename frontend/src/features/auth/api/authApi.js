/**
 * Authentication API
 * Handles login, signup, logout, token refresh
 */

import client from '../../api/client';

export const authApi = {
  login: (credentials) =>
    client.post('/auth/login', credentials).then((res) => res.data),

  signup: (userData) =>
    client.post('/auth/signup', userData).then((res) => res.data),

  logout: () =>
    client.post('/auth/logout', {}).then((res) => res.data),

  refreshToken: (refreshToken) =>
    client.post('/auth/refresh', { refreshToken }).then((res) => res.data),

  verify: () =>
    client.get('/auth/verify').then((res) => res.data),

  forgotPassword: (email) =>
    client.post('/auth/forgot-password', { email }).then((res) => res.data),

  resetPassword: (token, newPassword) =>
    client.post('/auth/reset-password', { token, newPassword }).then((res) => res.data),

  changePassword: (oldPassword, newPassword) =>
    client.post('/auth/change-password', { oldPassword, newPassword }).then((res) => res.data),
};

