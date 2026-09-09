import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderApi } from '@/api/orderApi'

export const fetchOrders = createAsyncThunk('order/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await orderApi.getOrders(params)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch orders')
  }
})

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await orderApi.getOrder(id)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order')
    }
  }
)

export const createOrder = createAsyncThunk('order/create', async (data, { rejectWithValue }) => {
  try {
    return await orderApi.createOrder(data)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create order')
  }
})

export const cancelOrder = createAsyncThunk('order/cancel', async (id, { rejectWithValue }) => {
  try {
    return await orderApi.cancelOrder(id)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to cancel order')
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    creating: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createOrder.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload
        }
      })
  },
})

export const { clearSelectedOrder } = orderSlice.actions
export default orderSlice.reducer
