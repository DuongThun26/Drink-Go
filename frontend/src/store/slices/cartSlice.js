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
    selectedItemIds: [],
    hasInitializedSelection: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = []
      state.totalPrice = 0
      state.selectedItemIds = []
      state.hasInitializedSelection = false
    },
    toggleSelectedCartItem: (state, action) => {
      const itemId = action.payload
      const exists = state.selectedItemIds.includes(itemId)
      state.hasInitializedSelection = true
      state.selectedItemIds = exists
        ? state.selectedItemIds.filter((id) => id !== itemId)
        : [...state.selectedItemIds, itemId]
    },
    toggleSelectAllCartItems: (state) => {
      const itemIds = state.items.map((item) => item.id)
      const allSelected =
        itemIds.length > 0 && itemIds.every((itemId) => state.selectedItemIds.includes(itemId))
      state.hasInitializedSelection = true
      state.selectedItemIds = allSelected ? [] : itemIds
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.items = action.payload.items || []
      state.totalPrice = action.payload.totalPrice || 0
      const itemIds = state.items.map((item) => item.id)
      if (!state.hasInitializedSelection) {
        state.selectedItemIds = itemIds
        state.hasInitializedSelection = true
      } else {
        state.selectedItemIds = state.selectedItemIds.filter((id) => itemIds.includes(id))
      }
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
        state.selectedItemIds = []
        state.hasInitializedSelection = false
      })
  },
})

export const { resetCart, toggleSelectedCartItem, toggleSelectAllCartItems } = cartSlice.actions
export default cartSlice.reducer
