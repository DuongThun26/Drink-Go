import client from '../../../../api/client.js';

export const cartApi = {
  getCart: (sessionId) => client.get('/cart', { params: { sessionId } }).then(r => r.data),
  addToCart: (itemData) => client.post('/cart/items', itemData).then(r => r.data),
  removeFromCart: (itemId, sessionId) => client.delete(`/cart/items/${itemId}`, { params: { sessionId } }).then(r => r.data),
  updateItem: (itemId, updateData) => client.patch(`/cart/items/${itemId}`, updateData).then(r => r.data),
  mergeCart: (guestSessionId) => client.post('/cart/merge', { guestSessionId }).then(r => r.data),
};
