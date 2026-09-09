import axiosClient from './axiosClient'

export const productApi = {
  getProducts: () => axiosClient.get('/products').then((res) => res.data),

  getProduct: (id) => axiosClient.get(`/products/${id}`).then((res) => res.data),

  getVariants: (productId) =>
    axiosClient.get(`/products/${productId}/variants`).then((res) => res.data),

  createProduct: (data) => axiosClient.post('/admin/products', data).then((res) => res.data),

  updateProduct: (id, data) =>
    axiosClient.put(`/admin/products/${id}`, data).then((res) => res.data),

  deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),

  // Size management APIs
  getSizes: () => axiosClient.get('/sizes').then((res) => res.data),

  getSize: (id) => axiosClient.get(`/sizes/${id}`).then((res) => res.data),

  createSize: (data) => axiosClient.post('/admin/sizes', data).then((res) => res.data),

  updateSize: (id, data) => axiosClient.put(`/admin/sizes/${id}`, data).then((res) => res.data),

  deleteSize: (id) => axiosClient.delete(`/admin/sizes/${id}`),

  // Variant management APIs
  createVariant: (productId, data) =>
    axiosClient.post(`/admin/products/${productId}/variants`, data).then((res) => res.data),

  updateVariant: (productId, variantId, data) =>
    axiosClient.put(`/admin/products/${productId}/variants/${variantId}`, data).then((res) => res.data),

  deleteVariant: (productId, variantId) =>
    axiosClient.delete(`/admin/products/${productId}/variants/${variantId}`),
}
