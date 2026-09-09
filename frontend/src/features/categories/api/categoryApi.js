import client from '../../../../api/client.js';

export const categoryApi = {
  getAll: (params) => client.get('/categories', { params }).then(r => r.data),
  getById: (id) => client.get(`/categories/${id}`).then(r => r.data),
};
