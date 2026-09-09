# 📋 Frontend Development Guidelines & Best Practices

---

## 🎯 CODING STANDARDS

### 1. NAMING CONVENTIONS

#### Files
```javascript
// Components
ProductCard.jsx         ✅ PascalCase for component files
UserProfile.jsx         ✅

// Hooks
useProducts.js          ✅ camelCase starting with 'use'
useAuth.js              ✅

// Utilities
currencyFormatter.js    ✅ camelCase for utility functions
tokenManager.js         ✅

// API
productApi.js           ✅ camelCase for API files
userApi.js              ✅

// Store
productSlice.js         ✅ camelCase for Redux slices
authThunks.js           ✅
productSelectors.js     ✅

// Constants
productConstants.js     ✅ camelCase
API_ENDPOINTS.js        ⚠️ Use camelCase file name

// Tests
ProductCard.test.jsx    ✅ Same name as component
useProducts.test.js     ✅ Same name as hook

// Styles
product-card.css        ✅ kebab-case for CSS
```

#### Variables & Functions
```javascript
// Variables - camelCase
const productList = [];     ✅
let isLoading = false;      ✅
const MAX_ITEMS = 10;       ✅ Constants UPPER_SNAKE_CASE

// Functions - camelCase
function fetchProducts() {} ✅
const handleClick = () => {};  ✅

// React Components - PascalCase
function ProductCard() {}   ✅
const UserProfile = () => {}; ✅

// Boolean functions - prefix with 'is' or 'has'
const isAuthenticated = true;     ✅
const hasPermission = false;      ✅
const canDelete = true;           ✅

// Handlers - prefix with 'handle'
const handleSubmit = () => {};    ✅
const handleInputChange = () => {}; ✅

// API/Fetch functions - prefix with 'fetch' or 'get'
const fetchProducts = () => {};   ✅
const getUser = () => {};         ✅

// Selectors - prefix with 'select'
const selectUser = (state) => state.user;          ✅
const selectCartItems = (state) => state.cart.items; ✅
```

#### CSS Classes
```javascript
// kebab-case for CSS classes
.btn-primary                ✅
.card-container             ✅
.product-grid               ✅
.header-navbar              ✅

// BEM methodology (optional but recommended)
.product-card                ✅ Block
.product-card__title         ✅ Element
.product-card--featured      ✅ Modifier
.product-card__title--large  ✅ Element with modifier
```

#### Constants
```javascript
// UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'http://localhost:8080';
const ITEMS_PER_PAGE = 12;
const MAX_RETRIES = 3;
const TOKEN_EXPIRY_TIME = 900000; // ms

// In constants files
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  // ...
};

export const USER_ROLES = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMIN: 'ADMIN',
};
```

### 2. COMPONENT STRUCTURE

```javascript
// ✅ CORRECT STRUCTURE

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Imports organized:
// 1. React
// 2. Redux/hooks
// 3. Custom hooks
// 4. APIs
// 5. Utilities
// 6. Constants
// 7. Store
// 8. Components
// 9. Styles

import { Button, Card } from '../../components/ui';
import { useProducts } from '../../features/products/hooks';
import { selectProducts } from '../../features/products/store/productSelectors';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ onProductClick }) {
  // 1. Hooks
  const [page, setPage] = useState(1);
  const products = useSelector(selectProducts);

  // 2. Effects
  useEffect(() => {
    // Initialize
  }, []);

  // 3. Handlers
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // 4. Render
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}

// 5. Prop validation
ProductGrid.propTypes = {
  onProductClick: PropTypes.func.isRequired,
};
```

### 3. HOOK USAGE

```javascript
// ✅ CORRECT - Custom Hook Pattern

// File: src/features/products/hooks/useProductDetail.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../store/productThunks';
import { selectSelectedProduct, selectProductLoading } from '../store/productSelectors';

export function useProductDetail(productId) {
  const dispatch = useDispatch();
  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductLoading);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  return { product, loading };
}

// ✅ Usage in component
function ProductDetailPage({ id }) {
  const { product, loading } = useProductDetail(id);

  if (loading) return <Loader />;
  return <ProductDetail product={product} />;
}

// ❌ DON'T do this - Logic in component
function ProductDetailPageBad({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id).then(setProduct).finally(() => setLoading(false));
  }, [id]);

  return <ProductDetail product={product} />;
}
```

### 4. STATE MANAGEMENT PATTERNS

```javascript
// ✅ Complex state → Use Redux
// Multiple features need this state
// Shared across many components
// State needs time-travel debugging

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

// ✅ Local state → Use useState
// Only used in one component
// Component-specific UI state
// Temporary form inputs

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  
  return <form>...</form>;
}

// ✅ Derived state → Use Selectors
// Computed from Redux state
// Used in multiple components
// Avoid recalculation

const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price, 0);

// ❌ DON'T - Put everything in Redux
// Simple form validation state  ❌
// Component visibility state    ❌
// One-off component data        ❌

// ❌ DON'T - Prop drill too deep
<GrandParent data={data}>
  <Parent data={data}>
    <Child data={data}>
      <GrandChild data={data} />  // ❌ Too many levels
    </Child>
  </Parent>
</GrandParent>

// ✅ DO - Use context or Redux for deep state
const DataContext = createContext();

<DataContext.Provider value={data}>
  <GrandParent>
    <Parent>
      <Child>
        <GrandChild />  // ✅ Access via context/Redux
      </Child>
    </Parent>
  </GrandParent>
</DataContext.Provider>
```

### 5. ERROR HANDLING

```javascript
// ✅ CORRECT Error Handling

// In Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response.data;
    } catch (error) {
      // Always return meaningful error message
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// In Components
function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (loading) return <PageLoader />;
  
  if (error) {
    return (
      <ErrorMessage
        message={error}
        action={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    );
  }

  return <ProductGrid products={products} />;
}

// ❌ DON'T - Silent errors
try {
  await fetchProducts();
} catch (error) {
  console.log('oops');  // ❌ No recovery
}

// ❌ DON'T - Generic errors
return rejectWithValue('Error');  // ❌ Not helpful

// ❌ DON'T - Unhandled promises
useEffect(() => {
  dispatch(fetchProducts());  // ❌ No error handling
}, [dispatch]);
```

### 6. PERFORMANCE OPTIMIZATION

```javascript
// ✅ Lazy Loading Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));

function Routes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Router>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Router>
    </Suspense>
  );
}

// ✅ Memoize components to prevent re-renders
const ProductCard = memo(function ProductCard({ product, onClick }) {
  return (
    <div onClick={onClick}>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}, (prevProps, nextProps) => prevProps.product.id === nextProps.product.id);

// ✅ useCallback for event handlers
function ProductGrid({ onProductClick }) {
  const handleClick = useCallback((productId) => {
    onProductClick(productId);
  }, [onProductClick]);

  return (
    // Pass handleClick to memoized children
  );
}

// ✅ useMemo for expensive calculations
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}, [items]);

// ❌ DON'T - Unnecessary renders
function ProductCard({ product }) {
  // Component re-renders every time parent renders
  // Even if product didn't change
}

// ❌ DON'T - Create functions in render
return items.map(item => (
  <ProductCard
    key={item.id}
    onClick={() => handleClick(item.id)}  // ❌ New function every render
  />
));

// ✅ DO - Move function outside
const handleItemClick = useCallback((itemId) => {
  handleClick(itemId);
}, []);

return items.map(item => (
  <ProductCard
    key={item.id}
    onClick={handleItemClick}
  />
));
```

---

## 📐 ARCHITECTURE PRINCIPLES

### SOLID Principles

**S - Single Responsibility**
```javascript
// ✅ Each component has one job
function LoginForm() {
  // Only handles login form
}

function UserProfile() {
  // Only displays user info
}

function ProtectedRoute() {
  // Only protects routes
}

// ❌ DON'T - Component does too much
function MainPage() {
  // Renders form, displays profile, handles auth, fetches data
}
```

**O - Open/Closed**
```javascript
// ✅ Open for extension, closed for modification
const Button = ({ variant = 'primary', children, ...props }) => {
  const variantStyles = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    danger: 'bg-red-500',
  };
  return <button className={variantStyles[variant]} {...props}>{children}</button>;
};

// Easy to add new variant without modifying existing code
```

**L - Liskov Substitution**
```javascript
// ✅ All form inputs should work the same way
function ProductFilter() {
  return (
    <>
      <TextInput {...textProps} />
      <SelectInput {...selectProps} />
      <CheckboxInput {...checkboxProps} />
      {/* All have same interface */}
    </>
  );
}
```

**I - Interface Segregation**
```javascript
// ✅ Depend on specific interfaces
function useProductDetail(productId) {
  // Only needs productId
  // Doesn't need user info, cart data, etc.
}

// ❌ DON'T - Require large objects
function useProductDetail(context) {
  // Requires entire app state
}
```

**D - Dependency Inversion**
```javascript
// ✅ Inject dependencies
function ProductCard({ product, onAddToCart }) {
  // Dependencies are passed in
  return <Card onClick={() => onAddToCart(product)} />;
}

// ❌ DON'T - Hard dependencies
function ProductCardBad({ product }) {
  const handleAddToCart = () => dispatch(addToCart(product));  // Hard dependency
}
```

### DRY (Don't Repeat Yourself)

```javascript
// ❌ REPEATED CODE
function UserProfile() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  return (
    <input value={name} onChange={handleNameChange} />
    <input value={phone} onChange={handlePhoneChange} />
    <input value={email} onChange={handleEmailChange} />
  );
}

// ✅ REUSABLE
const initialFormState = {
  name: '',
  phone: '',
  email: '',
};

function useFormState(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return { values, errors, handleChange, setErrors };
}

function UserProfile() {
  const { values, handleChange } = useFormState(initialFormState);

  return (
    <input name="name" value={values.name} onChange={handleChange} />
    <input name="phone" value={values.phone} onChange={handleChange} />
    <input name="email" value={values.email} onChange={handleChange} />
  );
}
```

### Clean Code

```javascript
// ✅ Clear, descriptive naming
const userHasValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isOrderReadyForCheckout = (cart) => cart.items.length > 0;
const formatCurrencyForDisplay = (amount) => `$${(amount / 100).toFixed(2)}`;

// ❌ Unclear naming
const check = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const ok = (c) => c.items.length > 0;
const fmt = (a) => `$${(a / 100).toFixed(2)}`;

// ✅ Small functions
function validateForm(data) {
  return validateEmail(data.email) && validatePhone(data.phone);
}

// ❌ Large function
function validateForm(data) {
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return false;
  }
  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    return false;
  }
  return true;
}
```

---

## 📊 FILE ORGANIZATION

### Feature Folder Example

```
src/features/products/
├── api/
│   ├── productApi.js           # API calls only
│   └── variantApi.js
│
├── store/
│   ├── productSlice.js         # Redux slice
│   ├── productSelectors.js     # Selectors
│   ├── productThunks.js        # Async actions
│   └── variantSlice.js
│
├── hooks/
│   ├── useProducts.js          # Feature-specific hooks
│   ├── useProduct.js
│   ├── useProductFilters.js
│   └── useVariants.js
│
├── components/
│   ├── ProductCard.jsx         # Presentational (UI)
│   ├── ProductGrid.jsx
│   ├── ProductDetail.jsx
│   ├── ProductFilter.jsx
│   ├── VariantSelector.jsx
│   └── AddToCartButton.jsx
│
├── pages/
│   ├── ProductsPage.jsx        # Page components (container)
│   ├── ProductDetailPage.jsx
│   └── SearchResultsPage.jsx
│
├── utils/
│   ├── productValidations.js   # Feature utilities
│   ├── productCalculations.js
│   └── productTransformers.js  # Data transformations
│
└── constants/
    └── productConstants.js     # Feature constants
```

### Component Types

```javascript
// Presentational (Pure, Reusable, No logic)
export function ProductCard({ product, onAdd }) {
  return (
    <Card>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Button onClick={() => onAdd(product)}>Add</Button>
    </Card>
  );
}

// Container (Logic, Redux connected)
function ProductsContainer() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const filters = useSelector(selectFilters);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <ProductGrid
      products={products}
      onAdd={handleAddToCart}
    />
  );
}

// Page (Route level)
export default function ProductsPage() {
  return <ProductsContainer />;
}
```

---

## ✅ CODE REVIEW CHECKLIST

- [ ] Follows naming conventions
- [ ] Components have single responsibility
- [ ] Props are validatedwith PropTypes or TypeScript
- [ ] Error states handled
- [ ] Loading states show
- [ ] No prop drilling
- [ ] Reusable components extracted
- [ ] Redux for global state only
- [ ] Selectors used instead of direct state
- [ ] Custom hooks for logic reuse
- [ ] No hardcoded values
- [ ] Constants defined
- [ ] Functions are pure when possible
- [ ] No side effects in render
- [ ] Console.log removed
- [ ] Comments where needed (not obvious code)
- [ ] Tests written for complex logic
- [ ] Accessibility (a11y) considered
- [ ] Performance optimized
- [ ] No unused imports

---

## 🚀 PERFORMANCE CHECKLIST

- [ ] Code splitting implemented
- [ ] Lazy loading for images
- [ ] Memoization for expensive components
- [ ] useCallback for event handlers
- [ ] useMemo for computations
- [ ] API calls optimized
- [ ] Bundle size analyzed
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No N+1 query problems
- [ ] Debouncing for search/filters
- [ ] Pagination instead of load-all
- [ ] Images optimized
- [ ] CSS optimized
- [ ] Unused dependencies removed

---

## 📝 DOCUMENTATION STANDARDS

- [ ] README.md created
- [ ] Component props documented
- [ ] API endpoints documented
- [ ] Redux store documented
- [ ] Custom hooks documented
- [ ] Setup instructions clear
- [ ] Environment variables documented
- [ ] Deployment instructions included
- [ ] Troubleshooting section added
- [ ] Development guidelines documented