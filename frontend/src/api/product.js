/**
 * Products API
 */

import client from '../../api/client';

export const productApi = {
  getProducts: (params = {}) =>
    client.get('/products', { params }).then((res) => res.data),

  getProduct: (id) =>
    client.get(`/products/${id}`).then((res) => res.data),

  searchProducts: (query) =>
    client.get('/products/search', { params: { q: query } }).then((res) => res.data),

  getProductsByCategory: (categoryId, params = {}) =>
    client.get(`/products/category/${categoryId}`, { params }).then((res) => res.data),

  getFeaturedProducts: (limit = 10) =>
    client.get('/products/featured', { params: { limit } }).then((res) => res.data),
};