import client from '../../../../api/client.js';

// This is a mock API. In a real app, this would interact with a payment provider's SDK.
export const paymentApi = {
  /**
   * Creates a payment intent on the server.
   * @param {number} amount - The amount to charge.
   * @returns {Promise<{clientSecret: string}>} - The client secret for the payment intent.
   */
  createPaymentIntent: (amount) => {
    return client.post('/payments/create-intent', { amount }).then(r => r.data);
  },

  /**
   * Saves a new payment method for the user.
   * @param {string} paymentMethodId - The ID from the payment provider (e.g., Stripe).
   * @returns {Promise<any>}
   */
  savePaymentMethod: (paymentMethodId) => {
    return client.post('/payments/methods', { paymentMethodId }).then(r => r.data);
  },

  /**
   * Gets the user's saved payment methods.
   * @returns {Promise<any>}
   */
  getPaymentMethods: () => {
    return client.get('/payments/methods').then(r => r.data);
  },
};
