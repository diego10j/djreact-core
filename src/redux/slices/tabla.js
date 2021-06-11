import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: false,
  data: [],
  columns: []
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET COLUMNS
    getColumns(state, action) {
      state.isLoading = false;
      state.columns = action.payload;
    },

    // GET DATA
    getData(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    }
  }
});
