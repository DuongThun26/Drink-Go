# 🔌 API Architecture

---

## 🎯 API LAYER PHILOSOPHY

```
Feature Component (UI)
    ↓
Custom Hook (useProducts)
    ↓
Redux Thunk (fetchProducts)
    ↓
API File (productApi.js)
    ↓
Axios Client (client.js)
    ↓ (interceptors: token, error handling, refresh)
Backend API
```

---

## 📋 AXIOS CLIENT SETUP

**File**: `src/api/client.js`

```javascript
// Structure overview
import axios from 'axios';
import { tokenManager } from '../utils/auth/tokenManager';
import { store } from '../app/store';
import { refreshToken, logout } from '../features/auth/store/authSlice';

// Create axios instance
const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== REQUEST INTERCEPTOR ==========
client.interceptors.request.use(
  (config) => {
    // Attach token to every request
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Attach sessionId for guest users if no auth
    if (!token) {
      const sessionId = tokenManager.getSessionId();
      if (sessionId) {
        config.headers['X-Session-ID'] = sessionId;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== RESPONSE INTERCEPTOR ==========
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshTokenValue = tokenManager.getRefreshToken();
        
        if (refreshTokenValue) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            { refreshToken: refreshTokenValue }
          );

          const newToken = response.data.token;
          tokenManager.setAccessToken(newToken);
          store.dispatch(refreshToken(newToken));

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        tokenManager.clearTokens();
        store.dispatch(logout());
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // User not authorized for this resource
      return Promise.reject({
        message: 'You do not have permission to access this resource',
        status: 403,
      });
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default client;
```

---

## 📦 API FILES STRUCTURE

### **1. AUTH API**
**File**: `src/api/auth.js`

```javascript
// Structure overview
import client from './client';

export const authApi = {
  // Login
  login: (credentials) =>
    client.post('/auth/login', credentials).then((res) => res.data),

  // Sign up
  signup: (userData) =>
    client.post('/auth/signup', userData).then((res) => res.data),

  // Logout
  logout: () =>
    client.post('/auth/logout').then((res) => res.data),

  // Refresh token
  refreshToken: () =>
    client.post('/auth/refresh').then((res) => res.data),

  // Verify token
  verify: () =>
    client.get('/auth/verify').then((res) => res.data),

  // Forgot password
  forgotPassword: (email) =>
    client.post('/auth/forgot-password', { email }).then((res) => res.data),

  // Reset password
  resetPassword: (token, newPassword) =>
    client.post('/auth/reset-password', { token, newPassword }).then((res) => res.data),
};
```

### **2. PRODUCT API**
**File**: `src/api/product.js`

```javascript
// Structure overview
import client from './client';

export const productApi = {
  // Get all products
  getProducts: (params) =>
    client.get('/products', { params }).then((res) => res.data),

  // Get product by ID
  getProduct: (id) =>
    client.get(`/products/${id}`).then((res) => res.data),

  // Search products
  searchProducts: (query) =>
    client.get('/products/search', { params: { q: query } }).then((res) => res.data),

  // Get products by category
  getProductsByCategory: (categoryId, params) =>
    client.get(`/products/category/${categoryId}`, { params }).then((res) => res.data),

  // Get featured products
  getFeaturedProducts: (limit = 10) =>
    client.get('/products/featured', { params: { limit } }).then((res) => res.data),
};
```

### **3. CART API**
**File**: `src/api/cart.js`

```javascript
// Structure overview
import client from './client';

export const cartApi = {
  // Get cart
  getCart: (sessionId) =>
    client.get('/cart', {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Add to cart
  addToCart: (item, sessionId) =>
    client.post('/cart/items', item, {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Update cart item
  updateCartItem: (itemId, data, sessionId) =>
    client.patch(`/cart/items/${itemId}`, data, {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Remove from cart
  removeFromCart: (itemId, sessionId) =>
    client.delete(`/cart/items/${itemId}`, {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Clear cart
  clearCart: (sessionId) =>
    client.delete('/cart', {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Merge guest cart to user cart
  mergeCart: (sessionId) =>
    client.post('/cart/merge', { sessionId }).then((res) => res.data),
};
```

### **4. ORDER API**
**File**: `src/api/order.js`

```javascript
// Structure overview
import client from './client';

export const orderApi = {
  // Create order
  createOrder: (orderData, sessionId) =>
    client.post('/orders', orderData, {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Get orders (user)
  getOrders: (params) =>
    client.get('/orders', { params }).then((res) => res.data),

  // Get order detail
  getOrderDetail: (id) =>
    client.get(`/orders/${id}`).then((res) => res.data),

  // Get order by code (guest)
  getOrderByCode: (code, sessionId) =>
    client.get(`/orders/code/${code}`, {
      params: { sessionId },
      headers: sessionId ? { 'X-Session-ID': sessionId } : {},
    }).then((res) => res.data),

  // Cancel order
  cancelOrder: (id) =>
    client.patch(`/orders/${id}/cancel`).then((res) => res.data),

  // Update order status (admin)
  updateOrderStatus: (id, status) =>
    client.patch(`/orders/${id}/status`, { status }).then((res) => res.data),
};
```

### **5. CATEGORY API**
**File**: `src/api/category.js`

```javascript
// Structure overview
import client from './client';

export const categoryApi = {
  // Get all categories
  getCategories: () =>
    client.get('/categories').then((res) => res.data),

  // Get category by ID
  getCategory: (id) =>
    client.get(`/categories/${id}`).then((res) => res.data),
};
```

### **6. PROMOTION API**
**File**: `src/api/promotion.js`

```javascript
// Structure overview
import client from './client';

export const promotionApi = {
  // Validate promo code
  validatePromoCode: (code) =>
    client.post('/promotions/validate', { code }).then((res) => res.data),

  // Get promotions
  getPromotions: () =>
    client.get('/promotions').then((res) => res.data),

  // Apply promo to order
  applyPromo: (orderId, promoCode) =>
    client.post(`/orders/${orderId}/apply-promo`, { promoCode }).then((res) => res.data),
};
```

### **7. TOPPING API**
**File**: `src/api/topping.js`

```javascript
// Structure overview
import client from './client';

export const toppingApi = {
  // Get all toppings
  getToppings: () =>
    client.get('/toppings').then((res) => res.data),

  // Get topping by ID
  getTopping: (id) =>
    client.get(`/toppings/${id}`).then((res) => res.data),
};
```

### **8. USER API**
**File**: `src/api/user.js`

```javascript
// Structure overview
import client from './client';

export const userApi = {
  // Get user profile
  getProfile: () =>
    client.get('/users/profile').then((res) => res.data),

  // Update user profile
  updateProfile: (data) =>
    client.patch('/users/profile', data).then((res) => res.data),

  // Get addresses
  getAddresses: () =>
    client.get('/users/addresses').then((res) => res.data),

  // Add address
  addAddress: (address) =>
    client.post('/users/addresses', address).then((res) => res.data),

  // Update address
  updateAddress: (id, address) =>
    client.patch(`/users/addresses/${id}`, address).then((res) => res.data),

  // Delete address
  deleteAddress: (id) =>
    client.delete(`/users/addresses/${id}`).then((res) => res.data),

  // Change password
  changePassword: (oldPassword, newPassword) =>
    client.post('/users/change-password', { oldPassword, newPassword }).then((res) => res.data),
};
```

### **9. ADDRESSAPI**
**File**: `src/api/address.js`

```javascript
// Structure overview
import client from './client';

export const addressApi = {
  // Get provinces (for address form)
  getProvinces: () =>
    client.get('/addresses/provinces').then((res) => res.data),

  // Get districts by province
  getDistricts: (provinceId) =>
    client.get(`/addresses/districts/${provinceId}`).then((res) => res.data),

  // Get wards by district
  getWards: (districtId) =>
    client.get(`/addresses/wards/${districtId}`).then((res) => res.data),

  // Verify address
  verifyAddress: (address) =>
    client.post('/addresses/verify', address).then((res) => res.data),
};
```

### **10. PAYMENT API**
**File**: `src/api/payment.js`

```javascript
// Structure overview
import client from './client';

export const paymentApi = {
  // Create payment session (for VNPay)
  createPaymentSession: (orderId) =>
    client.post(`/payments/orders/${orderId}/create-session`).then((res) => res.data),

  // Confirm payment
  confirmPayment: (orderId, paymentData) =>
    client.post(`/payments/orders/${orderId}/confirm`, paymentData).then((res) => res.data),

  // Get payment status
  getPaymentStatus: (orderId) =>
    client.get(`/payments/orders/${orderId}/status`).then((res) => res.data),

  // Cancel payment
  cancelPayment: (orderId) =>
    client.post(`/payments/orders/${orderId}/cancel`).then((res) => res.data),
};
```

---

## 📤 API INDEX FILE

**File**: `src/api/index.js`

```javascript
// Export all API modules
export { authApi } from './auth';
export { productApi } from './product';
export { categoryApi } from './category';
export { cartApi } from './cart';
export { orderApi } from './order';
export { promotionApi } from './promotion';
export { toppingApi } from './topping';
export { userApi } from './user';
export { addressApi } from './address';
export { paymentApi } from './payment';

// Import client for custom requests if needed
export { default as client } from './client';
```

---

## 🔄 API CALL FLOW

```
Component
    ↓
Hook (useProducts)
    ↓ dispatch(fetchProducts())
Redux Thunk (productThunks.js)
    ↓ productApi.getProducts()
API File (product.js)
    ↓ client.get('/products')
Axios Client (client.js)
    ↓ (add token, error handling)
HTTP Request
    ↓
Backend API
    ↓
Response
    ↓ (handle 401, retry logic)
Axios Interceptor
    ↓
Thunk receives response
    ↓ dispatches fulfilled action
Redux Slice
    ↓ updates state
Component gets new state from selector
    ↓
Re-render with data
```

---

## ✅ API BEST PRACTICES

1. **Single Responsibility** - Each API file handles one resource
2. **Consistent Method Naming** - Uses REST conventions
3. **Error Handling** - All thunks handle errors
4. **No Logic in API** - Keep API files pure
5. **Parametrized URLs** - Use path parameters for IDs
6. **Query Params** - Use for filtering, sorting, pagination
7. **Request Validation** - Validate on frontend before sending
8. **Response Transformation** - Normalize data in thunks
9. **Loading States** - Always show loading indicator
10. **Retry Logic** - Automatic retry for token refresh in interceptor

---

## 🔐 SECURITY HEADERS

Every request automatically includes:

```javascript
// From axios interceptor:
Authorization: Bearer {token}        // JWT token
X-Session-ID: {sessionId}            // For guest users
Content-Type: application/json
```

---

## 🛡️ ERROR HANDLING PATTERN

```javascript
// In thunks:
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response.data;
    } catch (error) {
      // Handle 401
      if (error.response?.status === 401) {
        // Already handled by interceptor
      }
      // Handle 403
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission');
      }
      // Handle 404
      if (error.response?.status === 404) {
        return rejectWithValue('Resource not found');
      }
      // Handle 5xx
      if (error.response?.status >= 500) {
        return rejectWithValue('Server error. Please try again later');
      }
      // Handle network error
      if (!error.response) {
        return rejectWithValue('Network error. Please check your connection');
      }
      // Default error
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);
```

---

## 📡 ENVIRONMENT CONFIGURATION

**File**: `.env.local`

```bash
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_AUTH_TOKEN_KEY=drinkgo_token
REACT_APP_SESSION_ID_KEY=drinkgo_session_id
```

**File**: `.env.production`

```bash
REACT_APP_API_URL=https://api.drinkgo.com/api/v1
REACT_APP_AUTH_TOKEN_KEY=drinkgo_token
REACT_APP_SESSION_ID_KEY=drinkgo_session_id
```

---

## 🔄 REQUEST/RESPONSE LIFECYCLE

```
Request:
  {
    method: 'GET/POST/PATCH/DELETE',
    url: '/path',
    headers: {
      'Authorization': 'Bearer {token}',
      'Content-Type': 'application/json',
      'X-Session-ID': '{sessionId}' // if guest
    },
    data: {} // for POST/PATCH
  }

Response:
  {
    status: 200/201/400/401/403/404/500,
    data: {
      success: true/false,
      data: {...},
      message: 'string',
      error: {} // if error
    }
  }
```

---

## 🚀 USAGE IN COMPONENTS

```javascript
// In custom hook (example):
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productThunks';
import { selectProducts, selectProductsError } from '../store/productSelectors';

export function useProducts() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const error = useSelector(selectProductsError);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return { products, loading, error };
}

// In component:
function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;
  
  return <ProductGrid products={products} />;
}
```

---

## 📋 API TESTING CHECKLIST

- [ ] All endpoints correctly mapped
- [ ] Token attached to logged-in requests
- [ ] SessionId attached to guest requests
- [ ] 401 triggers token refresh
- [ ] Refresh fails → redirect to login
- [ ] 403 shows permission error
- [ ] 404 shows not found error
- [ ] 5xx shows server error
- [ ] Network error handled gracefully
- [ ] Loading indicators show
- [ ] Error messages display

