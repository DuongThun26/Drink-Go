/**
 * Redux Store Configuration
 * Central store for all Redux slices
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/auth/store/authSlice';
import cartReducer from '../src/features/cart/store/cartSlice';
import productsReducer from '../src/features/products/store/productSlice';
import categoriesReducer from '../src/features/categories/store/categorySlice';
import ordersReducer from '../src/features/orders/store/orderSlice';
import promotionsReducer from '../src/features/promotions/store/promotionSlice';
import toppingsReducer from '../src/features/toppings/store/toppingSlice';
import userReducer from '../src/features/user/store/userSlice';
import paymentReducer from '../frontend/features/payment/store/paymentSlice';
import adminReducer from '../frontend/features/admin/store/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    toppings: toppingsReducer,
    orders: ordersReducer,
    payment: paymentReducer,
    promotions: promotionsReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setToken', 'cart/setSessionId'],
        ignoredPaths: ['auth.expiryTime'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;

