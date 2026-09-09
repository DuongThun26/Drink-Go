import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderApi } from '@/api/orderApi'
import { productApi } from '@/api/productApi'
import { categoryApi } from '@/api/adminApi'
import { toppingApi } from '@/api/toppingApi'
import { promotionApi } from '@/api/promotionApi'

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      return await orderApi.getAdminOrders(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await productApi.getProducts()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAdminCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryApi.getAll()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAdminToppings = createAsyncThunk(
  'admin/fetchToppings',
  async (_, { rejectWithValue }) => {
    try {
      return await toppingApi.getAll()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAdminPromotions = createAsyncThunk(
  'admin/fetchPromotions',
  async (_, { rejectWithValue }) => {
    try {
      return await promotionApi.getAll()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    orders: [],
    products: [],
    categories: [],
    toppings: [],
    promotions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.products = action.payload
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchAdminToppings.fulfilled, (state, action) => {
        state.toppings = action.payload
      })
      .addCase(fetchAdminPromotions.fulfilled, (state, action) => {
        state.promotions = action.payload
      })
  },
})

export default adminSlice.reducer
