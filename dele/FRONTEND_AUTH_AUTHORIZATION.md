# 🔐 Authentication & Authorization Architecture

---

## 🎯 AUTHENTICATION FLOW

### Complete Auth Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                  1. APP INITIALIZATION                  │
├─────────────────────────────────────────────────────────┤

App.jsx mounts
    ↓
  useEffect: Check stored token
    ├─ Token exists in localStorage?
    │   ├─ Yes: Dispatch verifyAuth thunk
    │   │   ├─ Backend validates token
    │   │   ├─ Success: Set Redux state (isAuthenticated=true, user)
    │   │   └─ Fail: Clear token, set isAuthenticated=false
    │   │
    │   └─ No: Check sessionId
    │       ├─ SessionId exists?
    │       │   └─ Yes: Continue as guest (setSessionId in Redux)
    │       │
    │       └─ No: Generate new sessionId
    │           └─ Store in localStorage and Redux

App ready for user
    ↓
Show public pages OR redirect based on role
```

### Login Flow

```
┌─────────────────────────────────────────────────────────┐
│              2. USER LOGIN (LoginPage.jsx)              │
├─────────────────────────────────────────────────────────┤

User fills login form
    ↓
User clicks "Login"
    ↓
Form validation (Zod)
    ├─ Validation fails → Show error
    └─ Validation passes → Next step
    ↓
Dispatch loginUser thunk
    ↓
API call: POST /auth/login { email, password }
    ├─ Backend validates credentials
    ├─ Success: Returns JWT + refreshToken
    └─ Fail: Returns 401 → Show error
    ↓
Thunk succeeds:
    ├─ Redux slice updates state:
    │   ├─ isAuthenticated = true
    │   ├─ user = { id, name, email, role }
    │   └─ token = JWT
    │
    ├─ Token stored in localStorage + Redux
    ├─ RefreshToken stored in httpOnly cookie
    │
    └─ Guest cart merged if sessionId exists
            ↓
          API: POST /cart/merge { sessionId }
            ↓
          Redux cart state updated with merged items
    ↓
Redirect to /dashboard or /products
    ↓
Protected routes now accessible
```

### Logout Flow

```
┌─────────────────────────────────────────────────────────┐
│             3. USER LOGOUT (Navbar Button)              │
├─────────────────────────────────────────────────────────┤

User clicks "Logout"
    ↓
Show confirmation if needed
    ↓
Dispatch logoutUser thunk
    ↓
API call: POST /auth/logout
    ├─ Backend invalidates token
    └─ Frontend doesn't wait for response
    ↓
TokenManager clears tokens:
    ├─ localStorage.removeItem('token')
    └─ axios Authorization header removed
    ↓
Redux state cleared:
    ├─ isAuthenticated = false
    ├─ user = null
    ├─ token = null
    ├─ cart items = []
    └─ orders = []
    ↓
Generate new sessionId for guest
    └─ setSessionId in Redux
    ↓
Redirect to /
    ↓
All protected routes inaccessible
```

### Token Refresh Flow

```
┌─────────────────────────────────────────────────────────┐
│          4. AUTO TOKEN REFRESH (In Background)          │
├─────────────────────────────────────────────────────────┤

User makes request with expired token
    ↓
Backend returns 401 Unauthorized
    ↓
Axios response interceptor catches 401
    ↓
Interceptor checks if refreshToken exists
    ├─ No refreshToken → Logout
    └─ Has refreshToken → Continue
    ↓
API call: POST /auth/refresh { refreshToken }
    ├─ Backend validates refreshToken
    ├─ Success: Returns new JWT
    └─ Fail: Return new 401 → Logout
    ↓
New token stored:
    ├─ localStorage update
    ├─ Redux state update
    └─ axios Authorization header update
    ↓
Retry original request with new token
    ├─ Success: Complete original request
    ├─ Fail: Handle error
```

---

## 🛡️ TOKEN MANAGEMENT

### Token Manager Utility

**File**: `src/utils/auth/tokenManager.js`

```javascript
// Structure overview
const TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || 'drinkgo_token';
const REFRESH_TOKEN_KEY = 'drinkgo_refresh_token';
const SESSION_ID_KEY = process.env.REACT_APP_SESSION_ID_KEY || 'drinkgo_session_id';

export const tokenManager = {
  // Token operations
  setAccessToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getAccessToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeAccessToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Refresh token operations
  setRefreshToken: (token) => {
    // Store in httpOnly cookie (recommended)
    // Or in localStorage if cookie not available
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Session ID for guests
  setSessionId: (sessionId) => {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  },

  getSessionId: () => {
    return localStorage.getItem(SESSION_ID_KEY);
  },

  generateSessionId: () => {
    const sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    tokenManager.setSessionId(sessionId);
    return sessionId;
  },

  // Check if token valid
  isTokenExpired: (token) => {
    // Decode JWT and check exp
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true; // If decode fails, treat as expired
    }
  },

  // Clear all tokens
  clearTokens: () => {
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
  },

  // Get authorization header
  getAuthHeader: () => {
    const token = tokenManager.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
```

---

## 🔑 SESSION ID MANAGEMENT (FOR GUESTS)

**File**: `src/utils/auth/sessionIdManager.js`

```javascript
// Structure overview
import { tokenManager } from './tokenManager';

export const sessionIdManager = {
  // Get or create session
  getOrCreateSessionId: () => {
    let sessionId = tokenManager.getSessionId();
    
    if (!sessionId) {
      sessionId = tokenManager.generateSessionId();
    }
    
    return sessionId;
  },

  // Get current session
  getCurrentSessionId: () => {
    return tokenManager.getSessionId();
  },

  // Clear session (on login)
  clearSessionId: () => {
    localStorage.removeItem(process.env.REACT_APP_SESSION_ID_KEY || 'drinkgo_session_id');
  },

  // Check if guest
  isGuest: (authState) => {
    return !authState.isAuthenticated && sessionIdManager.getCurrentSessionId();
  },

  // Check if user
  isUser: (authState) => {
    return authState.isAuthenticated;
  },

  // Is admin
  isAdmin: (authState) => {
    return authState.isAuthenticated && authState.user?.role === 'ADMIN';
  },
};
```

---

## 👤 PERMISSION CHECKER

**File**: `src/utils/auth/permissionChecker.js`

```javascript
// Structure overview
const PERMISSIONS = {
  // User permissions
  VIEW_PRODUCTS: 'view_products',
  ADD_TO_CART: 'add_to_cart',
  CREATE_ORDER: 'create_order',
  VIEW_OWN_ORDERS: 'view_own_orders',
  UPDATE_PROFILE: 'update_profile',

  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_TOPPINGS: 'manage_toppings',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_PROMOTIONS: 'manage_promotions',
  VIEW_STATISTICS: 'view_statistics',
  DELETE_USERS: 'delete_users',
  DELETE_PRODUCTS: 'delete_products',
};

const ROLE_PERMISSIONS = {
  USER: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.ADD_TO_CART,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.UPDATE_PROFILE,
  ],
  ADMIN: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.ADD_TO_CART,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_TOPPINGS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MANAGE_PROMOTIONS,
    PERMISSIONS.VIEW_STATISTICS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.DELETE_PRODUCTS,
  ],
  GUEST: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.ADD_TO_CART,
    PERMISSIONS.CREATE_ORDER,
  ],
};

export const permissionChecker = {
  // Check single permission
  hasPermission: (userRole, permission) => {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
  },

  // Check multiple permissions (AND)
  hasAllPermissions: (userRole, permissions) => {
    return permissions.every((permission) => 
      permissionChecker.hasPermission(userRole, permission)
    );
  },

  // Check multiple permissions (OR)
  hasAnyPermission: (userRole, permissions) => {
    return permissions.some((permission) => 
      permissionChecker.hasPermission(userRole, permission)
    );
  },

  // Can access resource
  canAccess: (userRole, resource) => {
    const accessMap = {
      'admin_panel': ['ADMIN'],
      'user_profile': ['USER', 'ADMIN'],
      'checkout': ['USER', 'GUEST', 'ADMIN'],
      'products': ['USER', 'GUEST', 'ADMIN'],
    };
    
    const allowedRoles = accessMap[resource] || [];
    return allowedRoles.includes(userRole);
  },

  // Get all permissions for role
  getPermissions: (userRole) => {
    return ROLE_PERMISSIONS[userRole] || [];
  },

  // Get role name
  getRoleName: (role) => {
    const roleNames = {
      'ADMIN': 'Administrator',
      'USER': 'User',
      'GUEST': 'Guest',
    };
    return roleNames[role] || 'Unknown';
  },
};
```

---

## 🔏 AUTH REDUCER & STATE

**File**: `src/features/auth/store/authSlice.js` (Detailed)

```javascript
const initialState = {
  // User information
  user: {
    id: null,
    email: null,
    name: null,
    phone: null,
    role: 'GUEST', // GUEST, USER, ADMIN
    avatar: null,
    preferences: {},
  },

  // Authentication state
  isAuthenticated: false,
  
  // Tokens
  token: null,
  refreshToken: null,
  expiryTime: null, // Timestamp when token expires
  
  // Session ID (for guests)
  sessionId: null,
  
  // Loading & Error
  loading: false,
  error: null,
  
  // Auth status
  initialized: false, // Set after initial auth check
};
```

---

## 🛣️ PROTECTED ROUTES IMPLEMENTATION

### Protected Route (User)

**File**: `src/routes/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/store/authSelectors';
import PageLoader from '../components/loaders/PageLoader';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
```

### Admin Route

**File**: `src/routes/AdminRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/store/authSelectors';
import UnauthorizedPage from '../components/layout/UnauthorizedPage';
import PageLoader from '../components/loaders/PageLoader';

export default function AdminRoute({ children }) {
  const user = useSelector(selectUser);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <PageLoader />;
  }

  if (user?.role !== 'ADMIN') {
    return <UnauthorizedPage />;
  }

  return children;
}
```

### Guest Route (Anonymous Only)

**File**: `src/routes/GuestRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/store/authSelectors';

export default function GuestRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    // Redirect authenticated users away from guest-only pages
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

---

## ✅ AUTH HOOKS

### useAuth Hook

**File**: `src/features/auth/hooks/useAuth.js`

```javascript
import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthToken,
} from '../store/authSelectors';

export function useAuth() {
  return {
    user: useSelector(selectUser),
    isAuthenticated: useSelector(selectIsAuthenticated),
    isAdmin: useSelector(selectIsAdmin),
    token: useSelector(selectAuthToken),
  };
}
```

### useLogin Hook

**File**: `src/features/auth/hooks/useLogin.js`

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authThunks';

export function useLogin() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    return result.payload;
  };

  return {
    login,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
  };
}
```

### useLogout Hook

**File**: `src/features/auth/hooks/useLogout.js`

```javascript
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/authThunks';

export function useLogout() {
  const dispatch = useDispatch();

  const logout = async () => {
    await dispatch(logoutUser());
  };

  return { logout };
}
```

---

## 🔄 AUTHORIZATION MATRIX

| Role | View Products | Cart | Checkout | Profile | Admin Panel |
|------|---|---|---|---|---|
| **Guest** | ✅ | ✅ | ✅ (limited) | ❌ | ❌ |
| **User** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔐 SECURITY BEST PRACTICES

### 1. Token Storage
✅ **httpOnly Cookies** (most secure)
- Cannot be accessed by JavaScript
- Automatically sent with requests
- Protected from XSS attacks

✅ **localStorage** (acceptable)
- Accessible but under your control
- Good for SPA applications
- Vulnerable to XSS if not careful

❌ **sessionStorage**
- Cleared on tab close
- Not suitable for persistent login

### 2. Token Refresh Strategy
```
Access Token Lifetime: 15 minutes
Refresh Token Lifetime: 7 days

On startup:
- Check for refresh token
- If exists, refresh immediately
- Use new token for requests

On 401:
- Use refresh token to get new access token
- Retry original request
- If refresh fails, logout
```

### 3. CORS & Security Headers
```javascript
// Backend should set:
Access-Control-Allow-Origin: https://drinkgo.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization

// App uses:
credentials: 'include' // For cookie-based auth
```

### 4. Input Validation
```javascript
// All forms validated with Zod before submission
const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});
```

### 5. HTTPS Only (Production)
- All requests to HTTPS
- Secure flag on cookies
- HSTS header enabled

---

## 📊 AUTHENTICATION STATE DIAGRAM

```
┌─────────────┐
│   GUEST     │  (sessionId, guest cart)
│ role: GUEST │
└────────┬────┘
         │ login/signup
         ↓
┌─────────────┐
│   USER      │  (token, user cart)
│ role: USER  │
└────────┬────┘
         │ logout
         ↓
┌─────────────┐
│   GUEST     │
│ role: GUEST │
└─────────────┘

  Special: ADMIN (role: ADMIN)
  - Same lifecycle as USER
  - Additional permissions
  - Access to admin panel
```

---

## ✅ CHECKLIST: AUTH IMPLEMENTATION

- [ ] TokenManager utility created
- [ ] SessionId generation for guests
- [ ] Auth reducer and thunks
- [ ] ProtectedRoute component
- [ ] AdminRoute component
- [ ] GuestRoute component
- [ ] useAuth, useLogin, useLogout hooks
- [ ] Axios interceptors setup
- [ ] Token refresh logic
- [ ] 401 error handling
- [ ] Cart merge after login
- [ ] Clear state on logout
- [ ] Permission checker utility
- [ ] Test login flow
- [ ] Test token refresh
- [ ] Test logout flow
- [ ] Test admin access
- [ ] Test guest access

---

## 🚀 INITIALIZATION PROCESS

When app first loads:

```javascript
// In App.jsx
useEffect(() => {
  const initialize = async () => {
    // 1. Check for existing token
    const token = tokenManager.getAccessToken();
    
    if (token) {
      // 2. Verify token with backend
      dispatch(verifyAuth()).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          // 3. Token valid, set Redux state
          setIsInitialized(true);
        } else {
          // 4. Token invalid or expired
          // Try to refresh
          dispatch(refreshToken()).then((refreshResult) => {
            setIsInitialized(true);
          });
        }
      });
    } else {
      // 5. Get or create session ID for guest
      const sessionId = sessionIdManager.getOrCreateSessionId();
      dispatch(setSessionId(sessionId));
      setIsInitialized(true);
    }
  };

  initialize();
}, [dispatch]);

// Don't render until initialized
if (!isInitialized) {
  return <PageLoader />;
}

return <Routes />;
```

This ensures proper authentication state before showing any content.

