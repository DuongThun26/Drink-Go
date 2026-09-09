# 📦 Redux Store Architecture

---

## 🏗️ STORE STRUCTURE

**File**: `src/app/store.js`

```javascript
// Structure overview - NOT full code yet
import {configureStore} from '@reduxjs/toolkit';

// Import all slices
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import productsReducer from './productSlice';
import categoriesReducer from './categorySlice';
import ordersReducer from './orderSlice';
import promotionsReducer from './promotionSlice';
import toppingsReducer from './toppingSlice';
import userReducer from './userSlice';
import paymentReducer from './src/features/payment/store/paymentSlice';
import adminReducer from './src/features/admin/store/adminSlice';

export const store = configureStore({
    reducer: {
        // Core features
        auth: authReducer,
        user: userReducer,

        // Shopping features
        products: productsReducer,
        categories: categoriesReducer,
        cart: cartReducer,
        toppings: toppingsReducer,

        // Transactional features
        orders: ordersReducer,
        payment: paymentReducer,
        promotions: promotionsReducer,

        // Admin features
        admin: adminReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/setToken', 'cart/setSessionId'],
                ignoredPaths: ['auth.expiryTime'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
```

---

## 🔐 AUTH SLICE

**File**: `src/features/auth/store/authSlice.js`

```javascript
// Structure overview
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser, logoutUser, refreshToken } from './authThunks';

const initialState = {
  // User info
  user: null,
  
  // Auth state
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  expiryTime: null,
  
  // Session state
  sessionId: null,
  
  // Loading states
  loading: false,
  
  // Error state
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Sync actions
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.expiryTime = action.payload.expiryTime;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.sessionId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sign up user
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout user
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
      });

    // Token refresh
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.expiryTime = action.payload.expiryTime;
      });
  },
});

export const { setToken, setSessionId, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🛒 CART SLICE

**File**: `src/features/cart/store/cartSlice.js`

```javascript
// Structure overview
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  mergeGuestCart 
} from './cartThunks';

const initialState = {
  // Cart items
  items: [],
  
  // Cart totals
  totalPrice: 0,
  discountAmount: 0,
  finalAmount: 0,
  
  // Session
  sessionId: null,
  
  // Loading & Error
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local actions
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.discountAmount = 0;
      state.finalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.finalAmount = action.payload.finalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      });

    // Merge carts
    builder
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.sessionId = null; // Clear session after merge
      });
  },
});

export const { setSessionId, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

---

## 📋 EXAMPLE SLICE STRUCTURE

**File**: `src/features/products/store/productSlice.js`

All slices follow this pattern:

```javascript
import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById } from './productThunks';

const initialState = {
  // Data
  items: [],
  selectedProduct: null,
  
  // Pagination
  page: 1,
  pageSize: 12,
  total: 0,
  
  // Filters
  filters: {
    category: null,
    search: '',
    sortBy: 'newest',
  },
  
  // Loading & Error
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.page = 1; // Reset to first page
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single product
    builder
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  },
});

export const { setFilters, setPage, clearFilters } = productSlice.actions;
export default productSlice.reducer;
```

---

## 🎯 SELECTORS (Per Feature)

Selectors provide access to derived state.

**File**: `src/features/auth/store/authSelectors.js`

```javascript
// Structure overview
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectSessionId = (state) => state.auth.sessionId;
```

**File**: `src/features/cart/store/cartSelectors.js`

```javascript
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartDiscount = (state) => state.cart.discountAmount;
export const selectCartFinalAmount = (state) => state.cart.finalAmount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectHasCartItems = (state) => state.cart.items.length > 0;
```

---

## ⚙️ THUNKS (Async Actions)

Thunks handle API calls and async logic.

**File**: `src/features/auth/store/authThunks.js`

```javascript
// Structure overview
import {createAsyncThunk} from '@reduxjs/toolkit';
import {authApi} from './api/authApi';
import {tokenManager} from '../../../utils/auth/tokenManager';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({email, password}, {rejectWithValue}) => {
        try {
            const response = await authApi.login({email, password});

            // Store tokens
            tokenManager.setAccessToken(response.token);
            tokenManager.setRefreshToken(response.refreshToken);

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, {rejectWithValue}) => {
        try {
            const response = await authApi.signup(userData);
            tokenManager.setAccessToken(response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Sign up failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {rejectWithValue}) => {
        try {
            await authApi.logout();
            tokenManager.clearTokens();
            return null;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, {rejectWithValue}) => {
        try {
            const response = await authApi.refreshToken();
            tokenManager.setAccessToken(response.token);
            return response;
        } catch (error) {
            tokenManager.clearTokens();
            return rejectWithValue('Token refresh failed');
        }
    }
);
```

---

## 📊 STATE STRUCTURE DIAGRAM

```
Redux Store
│
├── auth
│   ├── user: { id, name, email, role }
│   ├── isAuthenticated: boolean
│   ├── token: string
│   ├── sessionId: string (for guests)
│   ├── loading: boolean
│   └── error: string | null
│
├── cart
│   ├── items: [{ id, product, quantity, toppings, price }]
│   ├── totalPrice: number
│   ├── discountAmount: number
│   ├── finalAmount: number
│   ├── loading: boolean
│   └── error: string | null
│
├── products
│   ├── items: [{ id, name, price, image, category }]
│   ├── selectedProduct: { id, name, description, variants }
│   ├── filters: { category, search, sortBy }
│   ├── page: number
│   ├── total: number
│   ├── loading: boolean
│   └── error: string | null
│
├── orders
│   ├── items: [{ id, code, status, total, createdAt }]
│   ├── selectedOrder: { id, code, items, total, status }
│   ├── loading: boolean
│   └── error: string | null
│
└── ...other features
```

---

## 🔄 REDUX FLOW DIAGRAM

```
User Action
    ↓
Component dispatches action: dispatch(loginUser({ email, password }))
    ↓
Thunk intercepts: Creates async action
    ↓
API Call: authApi.login()
    ↓
Promise resolves
    ↓
Thunk dispatches: fulfilled action with response
    ↓
Slice extraReducers handle action
    ↓
State updated
    ↓
Selectors compute derived state
    ↓
Component re-renders with new state
    ↓
UI updates
```

---

## 📝 SLICE NAMING CONVENTIONS

```javascript
// Actions
reducerName/actionName
examples:
- auth/setToken
- auth/clearError
- cart/setSessionId
- products/setFilters

// Thunks
reducerName/actionName
examples:
- auth/loginUser
- cart/addToCart
- orders/fetchOrders
- products/fetchProducts

// Slices export
export const { action1, action2, ... } = sliceName.actions;
export default sliceNameReducer;

// Selectors
select + CamelCase
examples:
- selectUser
- selectIsAuthenticated
- selectCartItems
- selectCartTotal
```

---

## ✅ REDUX BEST PRACTICES

1. **One slice per feature** - Easy to manage and test
2. **Normalize state shape** - Avoid nested deeply
3. **Use selectors** - Never access state directly in components
4. **Separate thunks** - Keep API logic separate from reducers
5. **Error handling** - Always handle rejected promises
6. **Loading states** - Always show loading indicator
7. **Immutability** - Redux Toolkit uses Immer, but stay mindful
8. **Reusable reducers** - Create generic handlers for common patterns
9. **Async operations** - Use createAsyncThunk for API calls
10. **Memory management** - Clear state on logout

---

## 🎯 MIDDLEWARE CHAIN

```
Axios Interceptor
    ↓ (adds token)
Backend API
    ↓
Response received
    ↓
Axios Response Interceptor
    ↓ (handles 401, refreshes)
Redux Thunk
    ↓ (dispatches fulfilled/rejected)
Slice Reducer
    ↓ (updates state)
Selectors
    ↓
Components subscribe to selectors
    ↓
UI Updates
```

---

## 🚀 STORE INITIALIZATION

When app starts:

```javascript
1. Load stored token from localStorage/cookie
2. Dispatch checkAuthStatus thunk if token exists
3. Load guest sessionId from localStorage if exists
4. Set up axios interceptors
5. App is ready for use
```

When user logs in:

```javascript
1. Dispatch loginUser thunk
2. Token stored in Redux + Storage
3. Redux state updated
4. Protected routes become available
5. Cart is fetched with user data
```

When user logs out:

```javascript
1. Dispatch logoutUser thunk
2. Tokens cleared from storage
3. Redux state reset
4. User redirected to home page
5. Protected routes redirect to login
```