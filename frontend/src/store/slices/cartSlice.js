import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartApi } from '@/api/cartApi'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    return await cartApi.getCart()
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch cart')
  }
})

export const addCartItem = createAsyncThunk('cart/add', async (item, { rejectWithValue }) => {
  try {
    return await cartApi.addItem(item)
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to add item')
  }
})

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ id, item }, { rejectWithValue }) => {
    try {
      return await cartApi.updateItem(id, item)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update item')
    }
  }
)

export const removeCartItem = createAsyncThunk('cart/remove', async (id, { rejectWithValue }) => {
  try {
    await cartApi.removeItem(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to remove item')
  }
})

export const clearCartItems = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartApi.clearCart()
    return true
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to clear cart')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = []
      state.totalPrice = 0
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.items = action.payload.items || []
      state.totalPrice = action.payload.totalPrice || 0
    }

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        setCart(state, action)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addCartItem.pending, (state) => {
        state.loading = true
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false
        setCart(state, action)
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        setCart(state, action)
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.items = []
        state.totalPrice = 0
      })
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
