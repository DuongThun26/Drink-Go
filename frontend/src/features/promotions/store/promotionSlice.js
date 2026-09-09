import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promotionApi } from '../api/promotionApi.js';
import { fetchCart } from '../../cart/store/cartSlice.js'; // To refresh cart after applying promo

export const applyPromoCode = createAsyncThunk(
  'promotions/applyPromoCode',
  async ({ code, cartId }, { dispatch, rejectWithValue }) => {
    try {
      const result = await promotionApi.applyPromoCode(code, cartId);
      // After applying, refresh the cart to get updated totals
      dispatch(fetchCart(cartId)); 
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid promo code');
    }
  }
);

const initialState = {
  appliedCode: null,
  discountAmount: 0,
  loading: false,
  error: null,
};

const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    clearPromo: (state) => {
      state.appliedCode = null;
      state.discountAmount = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCode = action.meta.arg.code;
        // The actual discount is reflected in the cart slice, this is for UI feedback
        state.discountAmount = action.payload.discountAmount; 
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPromo } = promotionSlice.actions;
export default promotionSlice.reducer;
