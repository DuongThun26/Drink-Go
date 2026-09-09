import axiosClient from './axiosClient'

export const orderApi = {
  getOrders: (params) => axiosClient.get('/orders', { params }).then((res) => res.data),

  getOrder: (id) => axiosClient.get(`/orders/${id}`).then((res) => res.data),

  createOrder: (data) => axiosClient.post('/orders', data).then((res) => res.data),

  cancelOrder: (id) => axiosClient.patch(`/orders/${id}/cancel`).then((res) => res.data),

  getAdminOrders: (params) =>
    axiosClient.get('/admin/orders', { params }).then((res) => res.data),

  confirmOrder: (id) =>
    axiosClient.patch(`/admin/orders/${id}/confirm`).then((res) => res.data),

  preparingOrder: (id) =>
    axiosClient.patch(`/admin/orders/${id}/preparing`).then((res) => res.data),

  shippingOrder: (id) =>
    axiosClient.patch(`/admin/orders/${id}/shipping`).then((res) => res.data),

  deliveredOrder: (id) =>
    axiosClient.patch(`/admin/orders/${id}/delivered`).then((res) => res.data),

  completedOrder: (id) =>
    axiosClient.patch(`/admin/orders/${id}/completed`).then((res) => res.data),
}
