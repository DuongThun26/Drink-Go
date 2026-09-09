import client from '../../../../api/client.js';

export const promotionApi = {
  applyPromoCode: (code, cartId) => 
    client.post('/promotions/apply', { code, cartId }).then(r => r.data),
  
  getActivePromotions: () => 
    client.get('/promotions/active').then(r => r.data),
};
