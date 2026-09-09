import client from '../../../../api/client.js';

export const toppingApi = {
  getAll: (params) => client.get('/toppings', { params }).then(r => r.data),
  getById: (id) => client.get(`/toppings/${id}`).then(r => r.data),
  create: (data) => client.post('/toppings', data).then(r => r.data),
  update: (id, data) => client.patch(`/toppings/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/toppings/${id}`).then(r => r.data),
};
