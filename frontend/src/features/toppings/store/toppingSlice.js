import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toppingApi } from '../api/toppingApi.js';

export const fetchToppings = createAsyncThunk(
  'toppings/fetchToppings',
  async (params, { rejectWithValue }) => {
    try {
      return await toppingApi.getAll(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching toppings');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const toppingSlice = createSlice({
  name: 'toppings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchToppings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToppings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchToppings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default toppingSlice.reducer;
