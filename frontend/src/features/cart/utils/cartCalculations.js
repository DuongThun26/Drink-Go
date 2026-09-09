// This file is kept for reference, but most calculations are now handled by the backend.
// Frontend can use this for quick client-side estimations if needed.

/**
 * Calculates the total price of items in the cart.
 * @param {Array} items - Array of cart items.
 * @returns {number} The total price.
 */
export const calculateTotalPrice = (items) => {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Calculates the final amount after applying discounts.
 * @param {number} totalPrice - The total price of items.
 * @param {number} discountAmount - The amount of discount.
 * @returns {number} The final payable amount.
 */
export const calculateFinalAmount = (totalPrice, discountAmount = 0) => {
  const final = totalPrice - discountAmount;
  return final > 0 ? final : 0;
};
