import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: false,
  data: [],
  columnas: []
};

const slice = createSlice({
  name: 'tabla',
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
      state.columnas = action.payload;
    },

    // GET DATA
    getData(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    }
  }
});

export default slice.reducer;

export function getColumnasR(nombreTabla, campoPrimario, ide_opci = 0, numeroTabla) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await axios.post('/api/sistema/getColumnas', {
        nombreTabla,
        campoPrimario,
        ide_opci,
        numero_tabl: numeroTabla
      });
      dispatch(slice.actions.getColumnasSuccess(data.datos));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
