# 🏗️ DrinkGo React Frontend - Production Architecture

**Version**: 1.0.0  
**Date**: June 27, 2026  
**Tech Stack**: React 19 + Vite + Redux Toolkit  
**Architecture Pattern**: Feature-Based with Clean Architecture

---

## 📁 FOLDER STRUCTURE

```
drinkgo-frontend/
│
├── public/
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── store.js          # Redux store configuration
│   │
│   ├── api/                   # 🔌 API Layer (Independent by resource)
│   │   ├── client.js          # Axios instance with interceptors
│   │   ├── auth.js            # Authentication API
│   │   ├── user.js            # User management API
│   │   ├── product.js         # Product API
│   │   ├── category.js        # Category API
│   │   ├── cart.js            # Cart API
│   │   ├── order.js           # Order API
│   │   ├── promotion.js       # Promotion API
│   │   ├── topping.js         # Topping API
│   │   ├── address.js         # Address API
│   │   └── index.js           # Re-export all APIs
│   │
│   ├── features/              # 🎯 Feature-Based Structure
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.js             # Auth API calls
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── GuestCheckout.jsx
│   │   │   │   └── LogoutButton.jsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── SignupPage.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   ├── useLogin.js
│   │   │   │   └── useLogout.js
│   │   │   ├── store/
│   │   │   │   ├── authSlice.js          # Redux slice
│   │   │   │   └── authSelectors.js      # Selectors
│   │   │   ├── utils/
│   │   │   │   ├── tokenManager.js       # Token storage/retrieval
│   │   │   │   └── validations.js
│   │   │   └── constants/
│   │   │       └── authConstants.js
│   │   │
│   │   ├── products/
│   │   │   ├── api/
│   │   │   │   └── productApi.js
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   └── ProductVariantSelector.jsx
│   │   │   ├── pages/
│   │   │   │   ├── ProductsPage.jsx
│   │   │   │   └── ProductDetailPage.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.js
│   │   │   │   ├── useProduct.js
│   │   │   │   └── useProductFilters.js
│   │   │   ├── store/
│   │   │   │   ├── productSlice.js
│   │   │   │   └── productSelectors.js
│   │   │   ├── utils/
│   │   │   │   └── productUtils.js
│   │   │   └── constants/
│   │   │       └── productConstants.js
│   │   │
│   │   ├── categories/
│   │   │   ├── api/
│   │   │   │   └── categoryApi.js
│   │   │   ├── components/
│   │   │   │   ├── CategoryBrowser.jsx
│   │   │   │   ├── CategoryCard.jsx
│   │   │   │   └── CategoryList.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useCategories.js
│   │   │   ├── store/
│   │   │   │   ├── categorySlice.js
│   │   │   │   └── categorySelectors.js
│   │   │   └── constants/
│   │   │       └── categoryConstants.js
│   │   │
│   │   ├── cart/
│   │   │   ├── api/
│   │   │   │   └── cartApi.js
│   │   │   ├── components/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   ├── CartIcon.jsx
│   │   │   │   ├── AddToCartButton.jsx
│   │   │   │   └── CartEmpty.jsx
│   │   │   ├── pages/
│   │   │   │   └── CartPage.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCart.js
│   │   │   │   ├── useAddToCart.js
│   │   │   │   └── useCartMerge.js
│   │   │   ├── store/
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── cartSelectors.js
│   │   │   │   └── cartThunks.js
│   │   │   ├── utils/
│   │   │   │   ├── cartStorage.js        # LocalStorage for guest cart
│   │   │   │   ├── cartCalculations.js
│   │   │   │   └── sessionIdManager.js
│   │   │   └── constants/
│   │   │       └── cartConstants.js
│   │   │
│   │   ├── orders/
│   │   │   ├── api/
│   │   │   │   └── orderApi.js
│   │   │   ├── components/
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   ├── OrderSummary.jsx
│   │   │   │   ├── OrderItem.jsx
│   │   │   │   ├── OrderList.jsx
│   │   │   │   ├── OrderStatus.jsx
│   │   │   │   └── OrderTimeline.jsx
│   │   │   ├── pages/
│   │   │   │   ├── CheckoutPage.jsx
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   ├── OrderDetailPage.jsx
│   │   │   │   └── OrderConfirmationPage.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useOrder.js
│   │   │   │   ├── useOrders.js
│   │   │   │   ├── useCheckout.js
│   │   │   │   └── useOrderForm.js
│   │   │   ├── store/
│   │   │   │   ├── orderSlice.js
│   │   │   │   ├── orderSelectors.js
│   │   │   │   └── orderThunks.js
│   │   │   ├── utils/
│   │   │   │   ├── orderValidation.js
│   │   │   │   └── orderCalculations.js
│   │   │   └── constants/
│   │   │       └── orderConstants.js
│   │   │
│   │   ├── promotions/
│   │   │   ├── api/
│   │   │   │   └── promotionApi.js
│   │   │   ├── components/
│   │   │   │   ├── PromoCodeInput.jsx
│   │   │   │   ├── PromoDiscount.jsx
│   │   │   │   └── PromoBanner.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePromotion.js
│   │   │   │   ├── useApplyPromo.js
│   │   │   │   └── usePromoValidation.js
│   │   │   ├── store/
│   │   │   │   ├── promotionSlice.js
│   │   │   │   └── promotionSelectors.js
│   │   │   └── constants/
│   │   │       └── promotionConstants.js
│   │   │
│   │   ├── toppings/
│   │   │   ├── api/
│   │   │   │   └── toppingApi.js
│   │   │   ├── components/
│   │   │   │   ├── ToppingSelector.jsx
│   │   │   │   ├── ToppingOption.jsx
│   │   │   │   └── ToppingPreview.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useToppings.js
│   │   │   │   └── useToppingSelection.js
│   │   │   ├── store/
│   │   │   │   ├── toppingSlice.js
│   │   │   │   └── toppingSelectors.js
│   │   │   └── constants/
│   │   │       └── toppingConstants.js
│   │   │
│   │   ├── admin/
│   │   │   ├── api/
│   │   │   │   ├── adminApi.js
│   │   │   │   ├── userManagementApi.js
│   │   │   │   ├── productManagementApi.js
│   │   │   │   ├── orderManagementApi.js
│   │   │   │   ├── statisticsApi.js
│   │   │   │   └── categoryManagementApi.js
│   │   │   ├── components/
│   │   │   │   ├── Dashboard/
│   │   │   │   │   ├── StatCard.jsx
│   │   │   │   │   ├── Charts.jsx
│   │   │   │   │   └── RecentOrders.jsx
│   │   │   │   ├── UserManagement/
│   │   │   │   │   ├── UserTable.jsx
│   │   │   │   │   ├── UserForm.jsx
│   │   │   │   │   └── UserModal.jsx
│   │   │   │   ├── ProductManagement/
│   │   │   │   │   ├── ProductTable.jsx
│   │   │   │   │   ├── ProductForm.jsx
│   │   │   │   │   └── VariantManager.jsx
│   │   │   │   ├── CategoryManagement/
│   │   │   │   │   ├── CategoryTable.jsx
│   │   │   │   │   └── CategoryForm.jsx
│   │   │   │   ├── OrderManagement/
│   │   │   │   │   ├── OrderTable.jsx
│   │   │   │   │   ├── OrderFilter.jsx
│   │   │   │   │   └── OrderStatusUpdate.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── pages/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagementPage.jsx
│   │   │   │   ├── ProductManagementPage.jsx
│   │   │   │   ├── CategoryManagementPage.jsx
│   │   │   │   ├── OrderManagementPage.jsx
│   │   │   │   ├── VariantManagementPage.jsx
│   │   │   │   ├── ToppingManagementPage.jsx
│   │   │   │   ├── PromotionManagementPage.jsx
│   │   │   │   └── StatisticsPage.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAdminUsers.js
│   │   │   │   ├── useAdminProducts.js
│   │   │   │   ├── useAdminOrders.js
│   │   │   │   ├── useStatistics.js
│   │   │   │   ├── useAdminAuth.js
│   │   │   │   └── useAdminDashboard.js
│   │   │   ├── store/
│   │   │   │   ├── adminSlice.js
│   │   │   │   ├── adminSelectors.js
│   │   │   │   ├── userManagementSlice.js
│   │   │   │   └── statisticsSlice.js
│   │   │   └── constants/
│   │   │       └── adminConstants.js
│   │   │
│   │   ├── payment/
│   │   │   ├── api/
│   │   │   │   └── paymentApi.js
│   │   │   ├── components/
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   ├── PaymentMethod.jsx
│   │   │   │   └── PaymentConfirmation.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePayment.js
│   │   │   │   └── usePaymentValidation.js
│   │   │   ├── store/
│   │   │   │   ├── paymentSlice.js
│   │   │   │   └── paymentSelectors.js
│   │   │   └── constants/
│   │   │       └── paymentConstants.js
│   │   │
│   │   └── user/
│   │       ├── api/
│   │       │   └── userApi.js
│   │       ├── components/
│   │       │   ├── UserProfile.jsx
│   │       │   ├── AddressBook.jsx
│   │       │   ├── AddressForm.jsx
│   │       │   └── PreferencesForm.jsx
│   │       ├── pages/
│   │       │   ├── ProfilePage.jsx
│   │       │   ├── AddressesPage.jsx
│   │       │   └── PreferencesPage.jsx
│   │       ├── hooks/
│   │       │   ├── useUserProfile.js
│   │       │   ├── useUserAddresses.js
│   │       │   └── useUserUpdate.js
│   │       ├── store/
│   │       │   ├── userSlice.js
│   │       │   └── userSelectors.js
│   │       └── constants/
│   │           └── userConstants.js
│   │
│   ├── components/              # 🧩 Shared/Global Components
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Error.jsx
│   │   │   └── Breadcrumb.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   └── Page404.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Radio.jsx
│   │   │   └── Tabs.jsx
│   │   │
│   │   ├── form/
│   │   │   ├── FormField.jsx
│   │   │   ├── FormError.jsx
│   │   │   ├── FormSelect.jsx
│   │   │   └── FormCheckbox.jsx
│   │   │
│   │   ├── modals/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── ImageUploadModal.jsx
│   │   │   └── InfoModal.jsx
│   │   │
│   │   └── loaders/
│   │       ├── PageLoader.jsx
│   │       ├── SkeletonLoader.jsx
│   │       └── TableSkeleton.jsx
│   │
│   ├── hooks/                   # 🪝 Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useCart.js
│   │   ├── useLocalStorage.js
│   │   ├── useSessionStorage.js
│   │   ├── useDebounce.js
│   │   ├── useAsync.js
│   │   ├── usePagination.js
│   │   ├── useFetch.js
│   │   ├── useQuery.js
│   │   ├── useNotification.js
│   │   ├── useWindowSize.js
│   │   ├── useClickOutside.js
│   │   └── useForm.js
│   │
│   ├── utils/                   # 🛠️ Utility Functions
│   │   ├── api/
│   │   │   ├── apiErrorHandler.js
│   │   │   ├── apiInterceptors.js
│   │   │   └── apiHelpers.js
│   │   ├── auth/
│   │   │   ├── tokenManager.js
│   │   │   ├── sessionIdManager.js
│   │   │   └── permissionChecker.js
│   │   ├── validation/
│   │   │   ├── formValidations.js
│   │   │   ├── phoneValidation.js
│   │   │   ├── emailValidation.js
│   │   │   └── addressValidation.js
│   │   ├── formatting/
│   │   │   ├── currencyFormatter.js
│   │   │   ├── dateFormatter.js
│   │   │   ├── phoneFormatter.js
│   │   │   └── stringFormatter.js
│   │   ├── storage/
│   │   │   ├── localStorage.js
│   │   │   ├── sessionStorage.js
│   │   │   └── storageManager.js
│   │   ├── common/
│   │   │   ├── generateUUID.js
│   │   │   ├── debounce.js
│   │   │   ├── throttle.js
│   │   │   └── classNames.js
│   │   └── constants/
│   │       ├── apiConstants.js
│   │       ├── httpStatus.js
│   │       └── errorMessages.js
│   │
│   ├── constants/               # 📌 Global Constants
│   │   ├── apiEndpoints.js
│   │   ├── errorMessages.js
│   │   ├── successMessages.js
│   │   ├── appConfig.js
│   │   ├── roles.js
│   │   ├── permissions.js
│   │   ├── orderStatus.js
│   │   ├── paymentMethods.js
│   │   └── userTypes.js
│   │
│   ├── assets/                  # 📦 Static Assets
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── banner/
│   │   │   └── products/
│   │   ├── icons/
│   │   │   └── svg/
│   │   ├── fonts/
│   │   └── styles/
│   │       ├── themes/
│   │       ├── global.css
│   │       ├── variables.css
│   │       └── responsive.css
│   │
│   ├── routes/                  # 🛣️ Routing Configuration
│   │   ├── Routes.jsx           # Main routes
│   │   ├── ProtectedRoute.jsx   # Private routes
│   │   ├── AdminRoute.jsx       # Admin routes
│   │   ├── GuestRoute.jsx       # Guest routes
│   │   └── routesList.js        # Route definitions
│   │
│   ├── config/                  # ⚙️ Configuration
│   │   ├── env.js               # Environment variables
│   │   ├── axios.js             # Axios configuration
│   │   ├── redux.js             # Redux configuration
│   │   └── appConfig.js         # App-wide configuration
│   │
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
│
├── .env.example
├── .env.local
├── .env.production
├── .gitignore
├── vite.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── eslintrc.json
├── prettier.config.js
├── index.html
└── README.md
```

---

## 📦 PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "tailwindcss": "^3.3.6",
    "shadcn-ui": "^0.8.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.1",
    "date-fns": "^2.30.0",
    "js-cookie": "^3.0.5",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## 🎯 KEY ARCHITECTURAL DECISIONS

### 1. **Feature-Based Architecture**
- Each feature is self-contained with its own API, components, hooks, store
- Easy to locate code, refactor, and test
- Scalable for large applications

### 2. **Separation of Concerns**
- **API Layer**: Handles all backend communication
- **Redux Store**: Global state management
- **Hooks**: Business logic and reusable logic
- **Components**: UI presentation only

### 3. **Redux Store Organization**
- Each feature has its own slice
- Centralized selectors for derived state
- Separate thunks for async operations

### 4. **Naming Conventions**
- **Files**: camelCase (e.g., `productSlice.js`, `useProducts.js`)
- **Components**: PascalCase (e.g., `ProductCard.jsx`)
- **Functions**: camelCase (e.g., `fetchProducts()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **CSS Classes**: kebab-case (e.g., `btn-primary`)

### 5. **Authentication Strategy**
- JWT stored in httpOnly cookie OR secure localStorage
- Token refresh handled by axios interceptor
- Unauthorized requests redirect to login
- Guest users get sessionId from backend

### 6. **Guard Strategy**
- ProtectedRoute for authenticated users
- AdminRoute for admin-only pages
- GuestRoute for public pages
- Middleware checks role-based access

---

## 🔒 AUTHENTICATION & AUTHORIZATION

### JWT Flow
```
Login → Receive AccessToken + RefreshToken
        ↓
Store AccessToken (httpOnly or localStorage)
Store RefreshToken (httpOnly cookie)
        ↓
Attach AccessToken to every request header
        ↓
If 401 → Refresh token
        ↓
If refresh fails → Logout & redirect to login
```

### Guest User Flow
```
Enter app → Generate/Retrieve sessionId
        ↓
Store sessionId in localStorage
        ↓
Add sessionId to cart requests
        ↓
After login → Merge guest cart with user cart
        ↓
Continue with user cart
```

---

## ✅ NEXT STEPS

1. Create folder structure
2. Initialize Vite project
3. Configure Redux store
4. Setup API client with interceptors
5. Implement authentication system
6. Create protected routes
7. Build global components
8. Implement features