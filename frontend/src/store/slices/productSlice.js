import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productApi } from '@/api/productApi'
import { categoryApi } from '@/api/adminApi'

export const fetchProducts = createAsyncThunk('product/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await productApi.getProducts()
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch products')
  }
})

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await productApi.getProduct(id)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch product')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryApi.getAll()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories')
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    selectedProduct: null,
    categories: [],
    filters: {
      search: '',
      category: '',
      sortBy: 'name',
    },
    pagination: { page: 1, pageSize: 12 },
    loading: false,
    error: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload
      state.pagination.page = 1
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload
      state.pagination.page = 1
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { setSearch, setCategoryFilter, setSortBy, setPage, clearSelectedProduct } =
  productSlice.actions
export default productSlice.reducer
