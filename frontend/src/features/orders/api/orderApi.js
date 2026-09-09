import client from '../../../../api/client.js';

export const orderApi = {
  // Checkout
  createOrder: (orderData) => client.post('/orders', orderData).then(r => r.data),
  
  // Order History
  getOrders: (params) => client.get('/orders', { params }).then(r => r.data),
  getOrderById: (id) => client.get(`/orders/${id}`).then(r => r.data),

  // For Admins
  updateOrderStatus: (id, status) => client.patch(`/orders/${id}/status`, { status }).then(r => r.data),
};
