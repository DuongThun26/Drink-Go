/**
 * Products Redux Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../../../api/product.js';

// ============= THUNKS =============

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProduct(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productApi.searchProducts(query);
      return response;
    } catch (error) {
      return rejectWithValue('Search failed');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductsByCategory(categoryId, params);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch category products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await productApi.getFeaturedProducts(limit);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch featured products');
    }
  }
);

// ============= SLICE =============

const initialState = {
  items: [],
  selectedProduct: null,
  featuredProducts: [],
  searchResults: [],
  filters: {
    category: null,
    search: '',
    sortBy: 'newest',
    priceRange: [0, 1000000],
  },
  pagination: {
    page: 1,
    pageSize: 12,
    total: 0,
  },
  loading: false,
  searchLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.pagination.total = action.payload.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch product by id
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.items || [];
        state.filters.search = action.payload.query || '';
      })
      .addCase(searchProducts.rejected, (state) => {
        state.searchLoading = false;
        state.searchResults = [];
      });

    // Fetch by category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.pagination.total = action.payload.total || 0;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.loading = false;
      });

    // Fetch featured
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload.items || [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setFilters, setPage, clearFilters, clearSelectedProduct } =
  productSlice.actions;
export default productSlice.reducer;

