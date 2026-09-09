import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from '../api/categoryApi.js';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params, { rejectWithValue }) => {
    try {
      return await categoryApi.getAll(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching categories');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
