import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cartApi.js';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await cartApi.getCart(sessionId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      return await cartApi.addToCart(itemData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ itemId, sessionId }, { rejectWithValue }) => {
    try {
      await cartApi.removeFromCart(itemId, sessionId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

const initialState = {
  items: [],
  totalPrice: 0,
  discountAmount: 0,
  finalAmount: 0,
  sessionId: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.finalAmount = 0;
      state.discountAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.finalAmount = action.payload.finalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Assuming the API returns the updated cart
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.finalAmount = action.payload.finalAmount;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        // Recalculation of totals should happen on the backend, and fetchCart should be re-dispatched
      });
  },
});

export const { setSessionId, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
