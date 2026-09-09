import axiosClient, { getCartGuestHeader } from './axiosClient'

export const authApi = {
  login: (credentials) =>
    axiosClient
      .post('/auth/login', credentials, { headers: getCartGuestHeader() })
      .then((res) => res.data),

  register: (data) => axiosClient.post('/auth/register', data).then((res) => res.data),

  logout: () => axiosClient.post('/auth/logout').then((res) => res.data),

  refreshToken: (refreshToken) =>
    axiosClient.post('/auth/refresh', { refreshToken }).then((res) => res.data),

  forgotPassword: (username) =>
    axiosClient.post('/auth/forgot', { username }).then((res) => res.data),

  resetPassword: (data) => axiosClient.post('/auth/reset', data).then((res) => res.data),

  changePassword: (data) => axiosClient.post('/auth/change', data).then((res) => res.data),
}
