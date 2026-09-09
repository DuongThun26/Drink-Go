import axiosClient from './axiosClient'

export const promotionApi = {
  getAll: () => axiosClient.get('/promotions').then((res) => res.data),

  getById: (id) => axiosClient.get(`/promotions/${id}`).then((res) => res.data),

  validate: (data) => axiosClient.post('/promotions/validate', data).then((res) => res.data),

  create: (data) => axiosClient.post('/admin/promotions', data).then((res) => res.data),

  update: (id, data) => axiosClient.put(`/admin/promotions/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/admin/promotions/${id}`),
}
