import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cartApi.js';
import { fetchCart } from '../store/cartSlice.js';

// This thunk is not part of the slice as it's a specific action
const mergeCartThunk = createAsyncThunk(
  'cart/mergeCart',
  async (guestSessionId, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.mergeCart(guestSessionId);
      // After merging, fetch the user's now-updated cart
      dispatch(fetchCart()); 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge cart');
    }
  }
);

export function useCartMerge() {
  const dispatch = useDispatch();

  const mergeCart = (guestSessionId) => {
    if (guestSessionId) {
      dispatch(mergeCartThunk(guestSessionId));
    }
  };

  return { mergeCart };
}
