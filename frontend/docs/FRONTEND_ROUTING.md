# 🛣️ React Frontend - Routing Architecture

---

## 📋 ROUTE STRUCTURE

### Public Routes
```javascript
/                        → HomePage
/products                → ProductsPage
/products/:id            → ProductDetailPage
/category/:id            → CategoryPage
/search                  → SearchResultsPage
/about                   → AboutPage
/contact                 → ContactPage
```

### Authentication Routes
```javascript
/auth/login              → LoginPage
/auth/signup             → SignupPage
/auth/forgot-password    → ForgotPasswordPage
/auth/reset-password/:token → ResetPasswordPage
```

### Guest Routes
```javascript
/checkout                → CheckoutPage (anonymous)
/orders/guest/:sessionId → GuestOrderPage
```

### Protected Routes (User)
```javascript
/dashboard               → UserDashboard
/cart                    → CartPage
/checkout/user           → CheckoutPage (authenticated)
/orders                  → OrdersPage
/orders/:id              → OrderDetailPage
/profile                 → ProfilePage
/profile/addresses       → AddressesPage
/profile/preferences     → PreferencesPage
/payment/confirm         → PaymentConfirmationPage
```

### Admin Routes
```javascript
/admin                            → AdminDashboard
/admin/users                      → UserManagementPage
/admin/users/:id/edit             → UserEditPage
/admin/products                   → ProductManagementPage
/admin/products/create            → ProductCreatePage
/admin/products/:id/edit          → ProductEditPage
/admin/categories                 → CategoryManagementPage
/admin/categories/create          → CategoryCreatePage
/admin/categories/:id/edit        → CategoryEditPage
/admin/variants                   → VariantManagementPage
/admin/variants/create            → VariantCreatePage
/admin/variants/:id/edit          → VariantEditPage
/admin/toppings                   → ToppingManagementPage
/admin/toppings/create            → ToppingCreatePage
/admin/toppings/:id/edit          → ToppingEditPage
/admin/promotions                 → PromotionManagementPage
/admin/promotions/create          → PromotionCreatePage
/admin/promotions/:id/edit        → PromotionEditPage
/admin/orders                     → OrderManagementPage
/admin/orders/:id                 → OrderDetailPage
/admin/statistics                 → StatisticsPage
```

### Error Routes
```javascript
/404                     → NotFoundPage
*                        → NotFoundPage (catch-all)
```

---

## 🔐 ROUTE PROTECTION TYPES

### 1. **Public Route** (No Protection)
```javascript
<Route path="/products" element={<ProductsPage />} />
```

### 2. **Protected Route** (Authentication Required)
```javascript
<Route 
  path="/cart" 
  element={
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  } 
/>
```

### 3. **Admin Route** (Admin Role Required)
```javascript
<Route 
  path="/admin/users" 
  element={
    <AdminRoute>
      <UserManagementPage />
    </AdminRoute>
  } 
/>
```

### 4. **Guest Route** (Anonymous Only)
```javascript
<Route 
  path="/checkout" 
  element={
    <GuestRoute>
      <CheckoutPage />
    </GuestRoute>
  } 
/>
```

---

## 📝 ROUTE CONFIGURATION FILE

**File**: `src/routes/routesList.js`

```javascript
// Public routes
export const PUBLIC_ROUTES = [
  { path: '/', element: 'HomePage', icon: 'Home' },
  { path: '/products', element: 'ProductsPage', icon: 'ShoppingCart' },
  { path: '/products/:id', element: 'ProductDetailPage', icon: null },
  { path: '/category/:id', element: 'CategoryPage', icon: null },
];

// Auth routes
export const AUTH_ROUTES = [
  { path: '/auth/login', element: 'LoginPage', icon: 'LogIn' },
  { path: '/auth/signup', element: 'SignupPage', icon: 'UserPlus' },
  { path: '/auth/forgot-password', element: 'ForgotPasswordPage', icon: null },
];

// Protected routes (authenticated users)
export const PROTECTED_ROUTES = [
  { path: '/cart', element: 'CartPage', icon: 'ShoppingCart' },
  { path: '/checkout/user', element: 'CheckoutPage', icon: null },
  { path: '/orders', element: 'OrdersPage', icon: 'FileText' },
  { path: '/orders/:id', element: 'OrderDetailPage', icon: null },
  { path: '/profile', element: 'ProfilePage', icon: 'User' },
  { path: '/profile/addresses', element: 'AddressesPage', icon: 'MapPin' },
  { path: '/profile/preferences', element: 'PreferencesPage', icon: 'Settings' },
];

// Admin routes
export const ADMIN_ROUTES = [
  { path: '/admin', element: 'AdminDashboard', icon: 'BarChart3' },
  { path: '/admin/users', element: 'UserManagementPage', icon: 'Users' },
  { path: '/admin/products', element: 'ProductManagementPage', icon: 'Package' },
  { path: '/admin/categories', element: 'CategoryManagementPage', icon: 'FolderOpen' },
  { path: '/admin/variants', element: 'VariantManagementPage', icon: 'Layers' },
  { path: '/admin/toppings', element: 'ToppingManagementPage', icon: 'UtensilsCrossed' },
  { path: '/admin/promotions', element: 'PromotionManagementPage', icon: 'Percent' },
  { path: '/admin/orders', element: 'OrderManagementPage', icon: 'ShoppingBag' },
  { path: '/admin/statistics', element: 'StatisticsPage', icon: 'BarChart3' },
];

// Guest routes (anonymous)
export const GUEST_ROUTES = [
  { path: '/checkout', element: 'CheckoutPage', icon: null },
];

// Error routes
export const ERROR_ROUTES = [
  { path: '/404', element: 'NotFoundPage', icon: null },
  { path: '*', element: 'NotFoundPage', icon: null },
];
```

---

## 🎯 ROUTES.JSX IMPLEMENTATION

**File**: `src/routes/Routes.jsx`

```javascript
// Structure preview - NOT full code yet
import {BrowserRouter, Routes as RouterRoutes, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

// Public Pages
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import ProductDetailPage from './ProductDetailPage';

// Auth Pages
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

// User Pages
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrdersPage from './OrdersPage';
import OrderDetailPage from './OrderDetailPage';
import ProfilePage from './ProfilePage';

// Admin Pages
import AdminDashboard from './AdminDashboard';
import UserManagementPage from './UserManagementPage';
import ProductManagementPage from './ProductManagementPage';

// Error Page
import NotFoundPage from './src/components/layout/Page404';

export default function Routes() {
    return (
        <BrowserRouter>
            <RouterRoutes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<HomePage/>}/>
                <Route path="/products" element={<ProductsPage/>}/>
                <Route path="/products/:id" element={<ProductDetailPage/>}/>

                {/* AUTH ROUTES */}
                <Route path="/auth/login" element={<LoginPage/>}/>
                <Route path="/auth/signup" element={<SignupPage/>}/>

                {/* PROTECTED ROUTES (User) */}
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <CartPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout/user"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <OrdersPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute>
                            <OrderDetailPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage/>
                        </ProtectedRoute>
                    }
                />

                {/* GUEST CHECKOUT ROUTES */}
                <Route
                    path="/checkout"
                    element={
                        <GuestRoute>
                            <CheckoutPage/>
                        </GuestRoute>
                    }
                />

                {/* ADMIN ROUTES */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard/>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <UserManagementPage/>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <AdminRoute>
                            <ProductManagementPage/>
                        </AdminRoute>
                    }
                />

                {/* ERROR ROUTES */}
                <Route path="/404" element={<NotFoundPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </RouterRoutes>
        </BrowserRouter>
    );
}
```

---

## 🔐 PROTECTED ROUTE WRAPPER

**File**: `src/routes/ProtectedRoute.jsx`

```javascript
// Structure - NOT full code yet
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectIsAuthenticated} from './src/features/auth/store/authSelectors';
import PageLoader from './src/components/loaders/PageLoader';

export default function ProtectedRoute({children}) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);

    if (isLoading) return <PageLoader/>;

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace/>;
    }

    return children;
}
```

---

## 👨‍💼 ADMIN ROUTE WRAPPER

**File**: `src/routes/AdminRoute.jsx`

```javascript
// Structure - NOT full code yet
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectIsAdmin} from './src/features/auth/store/authSelectors';
import PageLoader from './src/components/loaders/PageLoader';
import UnauthorizedPage from './src/components/layout/UnauthorizedPage';

export default function AdminRoute({children}) {
    const isAdmin = useSelector(selectIsAdmin);
    const isLoading = useSelector(selectAuthLoading);

    if (isLoading) return <PageLoader/>;

    if (!isAdmin) {
        return <UnauthorizedPage/>;
    }

    return children;
}
```

---

## 👤 GUEST ROUTE WRAPPER

**File**: `src/routes/GuestRoute.jsx`

```javascript
// Structure - NOT full code yet
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectIsAuthenticated} from './src/features/auth/store/authSelectors';

export default function GuestRoute({children}) {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // If user is authenticated, redirect to user checkout
    if (isAuthenticated) {
        return <Navigate to="/checkout/user" replace/>;
    }

    return children;
}
```

---

## 🔄 ROUTE TRANSITIONS

### Login Flow
```
/auth/login → Verify credentials → Success
           → Store token
           → Redirect to /dashboard or previous page
           → Fail: Show error message
```

### Logout Flow
```
User clicks logout
           → Clear token from storage
           → Clear Redux store
           → Redirect to /
           → Hide protected routes
```

### Cart Merge Flow
```
Guest adds items → Cart stored with sessionId
              ↓
User logs in → Checkout page
              ↓
Click "Continue as User"
              ↓
Backend merges guest cart + user cart
              ↓
Redirect to /checkout/user → Show merged cart
```

### Guest Checkout Flow
```
Guest adds items → /cart (anonymous)
              ↓
Click "Proceed to Checkout"
              ↓
/checkout (guest route) → Collect address & payment
              ↓
Submit order with sessionId
              ↓
Backend creates guest order
              ↓
/orders/guest/:sessionId → Order confirmation
```

### User Checkout Flow
```
User adds items → /cart (protected)
             ↓
Click "Proceed to Checkout"
             ↓
/checkout/user (protected) → Pre-filled with saved addresses
             ↓
Submit order with userId
             ↓
Backend creates user order
             ↓
/orders/:id → Order confirmation
```

---

## 🎨 LAYOUT WRAPPERS

Each route type uses different layouts:

### Public Pages Layout
```
┌─────────────────────────────────────────────────────┐
│                    Header/Navbar                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐   ┌──────────────────────┐   │
│  │   Sidebar Nav   │   │    Page Content      │   │
│  │  (Categories)   │   │                      │   │
│  │                 │   │                      │   │
│  └─────────────────┘   └──────────────────────┘   │
│                                    ┌──────────┐   │
│                                    │ Cart Box │   │
│                                    └──────────┘   │
├─────────────────────────────────────────────────────┤
│                    Footer                           │
└─────────────────────────────────────────────────────┘
```

### Admin Layout
```
┌──────────────────────────────────────────────────────┐
│  Navbar (Admin Panel)                               │
├──────────┬────────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │         Page Content                      │
│ Menu     │                                           │
│          │                                           │
│          │                                           │
└──────────┴────────────────────────────────────────────┘
```

### Auth Layout
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│           ┌───────────────────────────┐             │
│           │   Login/Signup Form       │             │
│           │   (Centered)              │             │
│           │                           │             │
│           └───────────────────────────┘             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📊 ROUTE GUARD FLOWCHART

```
User navigates to route
       ↓
Check route type
       ├─→ Public Route? → Allow
       │
       ├─→ Protected Route?
       │       ├─→ Authenticated? → Allow
       │       └─→ Not authenticated? → Redirect to /auth/login
       │
       ├─→ Admin Route?
       │       ├─→ Authenticated && Admin? → Allow
       │       └─→ Not admin? → Show 403 Unauthorized
       │
       ├─→ Guest Route?
       │       ├─→ Not authenticated? → Allow
       │       └─→ Authenticated? → Redirect to /checkout/user
       │
       └─→ 404? → Show not found page
```

---

## ✅ ROUTE CONFIGURATION BEST PRACTICES

1. **Centralize Routes**: Keep all routes in `routesList.js`
2. **Lazy Loading**: Use React.lazy() for code splitting
3. **Error Boundaries**: Wrap routes with error boundaries
4. **Loading States**: Show loaders while checking auth
5. **Redirect Logic**: Clear redirect after auth check
6. **Deep Links**: Support direct URL access after login
7. **Route Transitions**: Smooth animations when switching routes
8. **Query Params**: Use for filters, pagination, search
9. **Nested Routes**: Organize related routes together
10. **Base Paths**: Consider using /api path prefix for URLs

---

## 🔄 ROUTE TRANSITION MIDDLEWARE

Routes will automatically handle:
- Token validation before each request
- Automatic token refresh on 401
- Redirect to login on auth failure
- Loading indicator during transitions
- Error handling with user feedback
- Deep link preservation (return user to intended page after login)