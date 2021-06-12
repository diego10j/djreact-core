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
    getColumnasSuccess(state, action) {
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

export default slice.reducer;

export function getColumnas(nombreTabla, campoPrimario, ide_opci = 0, numero_tabl) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await axios.post('/api/sistema/getColumnas', {
        nombreTabla,
        campoPrimario,
        ide_opci,
        numero_tabl
      });
      dispatch(slice.actions.getColumnasSuccess(data.datos));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
