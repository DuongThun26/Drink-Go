import axiosClient from './axiosClient'
import { productApi } from './productApi'
import { toppingApi } from './toppingApi'
import { promotionApi } from './promotionApi'
import { orderApi } from './orderApi'

export const categoryApi = {
  getAll: () => axiosClient.get('/categories').then((res) => res.data),

  getById: (id) => axiosClient.get(`/categories/${id}`).then((res) => res.data),

  create: (data) => axiosClient.post('/admin/categories', data).then((res) => res.data),

  update: (id, data) => axiosClient.put(`/admin/categories/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/admin/categories/${id}`),
}

export const addressApi = {
  getAll: () => axiosClient.get('/users/me/addresses').then((res) => res.data),

  create: (data) => axiosClient.post('/users/me/addresses', data).then((res) => res.data),

  update: (id, data) => axiosClient.put(`/users/me/addresses/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/users/me/addresses/${id}`),

  createGuest: (data) => axiosClient.post('/address/guest', data).then((res) => res.data),
}

export const adminApi = {
  ...productApi,
  categories: categoryApi,
  toppings: toppingApi,
  promotions: promotionApi,
  orders: orderApi,
}
