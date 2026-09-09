import axiosClient from './axiosClient'

export const cartApi = {
  getCart: () => axiosClient.get('/cart').then((res) => res.data),

  addItem: (item) => axiosClient.post('/cart/items', item).then((res) => res.data),

  updateItem: (id, item) => axiosClient.put(`/cart/items/${id}`, item).then((res) => res.data),

  removeItem: (id) => axiosClient.delete(`/cart/items/${id}`),

  clearCart: () => axiosClient.delete('/cart/items'),
}
