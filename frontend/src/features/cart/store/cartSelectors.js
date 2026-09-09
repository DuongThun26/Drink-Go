export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartDiscountAmount = (state) => state.cart.discountAmount;
export const selectCartFinalAmount = (state) => state.cart.finalAmount;
export const selectCartSessionId = (state) => state.cart.sessionId;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
