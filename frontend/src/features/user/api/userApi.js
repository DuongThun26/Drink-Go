import client from '../../../../api/client.js';

export const userApi = {
  // Profile
  getProfile: () => client.get('/user/profile').then(r => r.data),
  updateProfile: (profileData) => client.put('/user/profile', profileData).then(r => r.data),

  // Addresses
  getAddresses: () => client.get('/user/addresses').then(r => r.data),
  addAddress: (addressData) => client.post('/user/addresses', addressData).then(r => r.data),
  updateAddress: (id, addressData) => client.put(`/user/addresses/${id}`, addressData).then(r => r.data),
  deleteAddress: (id) => client.delete(`/user/addresses/${id}`).then(r => r.data),
};
