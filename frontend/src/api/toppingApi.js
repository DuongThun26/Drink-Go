import axiosClient from './axiosClient'

export const toppingApi = {
  getAll: () => axiosClient.get('/toppings').then((res) => res.data),

  create: (data) => axiosClient.post('/admin/toppings', data).then((res) => res.data),

  update: (id, data) => axiosClient.put(`/admin/toppings/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/admin/toppings/${id}`),
}
