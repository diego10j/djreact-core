import jwtDecode from 'jwt-decode';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: {}
};

const slice = createSlice({
  name: 'authJwt',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // INITIALISE
    getInitialize(state, action) {
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },

    // LOGIN
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // REGISTER
    registerSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // LOGOUT
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common['x-token'] = accessToken;
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common['x-token'];
  }
};

// ----------------------------------------------------------------------

export function login({ email, password }) {
  return async (dispatch) => {
    const response = await axios.post('/api/seguridad/login', {
      email,
      clave: password,
      identificacion: 'react',
      ip: '127.0.0.1',
      dispositivo: 'Web React'
    });
    const { token, datos } = response.data;
    const user = {
      id: datos.ide_usua,
      displayName: datos.nombre,
      email: datos.email,
      password: '*******',
      photoURL: datos.avatar,
      phoneNumber: '+40 777666555',
      country: 'Ecuador',
      address: 'Sin Dirección',
      state: 'Pichincha',
      city: 'Quito',
      zipCode: '710001',
      about: '',
      role: 'admin',
      isPublic: true
    };
    setSession(token);
    dispatch(slice.actions.loginSuccess({ user }));
  };
}

// ----------------------------------------------------------------------

export function register({ email, password, firstName, lastName }) {
  return async (dispatch) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { token, datos } = response.data;
    window.localStorage.setItem('accessToken', token);
    dispatch(slice.actions.registerSuccess({ datos }));
  };
}

// ----------------------------------------------------------------------

export function logout() {
  return async (dispatch) => {
    setSession(null);
    dispatch(slice.actions.logoutSuccess());
  };
}

// ----------------------------------------------------------------------

export function getInitialize() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const response = await axios.get('/api/seguridad/renew');
        const { datos } = response.data;
        const user = {
          id: datos.ide_usua,
          displayName: datos.nombre,
          email: datos.email,
          password: '*******',
          photoURL: datos.avatar,
          phoneNumber: '+40 777666555',
          country: 'Ecuador',
          address: 'Sin Dirección',
          state: 'Pichincha',
          city: 'Quito',
          zipCode: '710001',
          about: '',
          role: 'admin',
          isPublic: true
        };

        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: true,
            user
          })
        );
      } else {
        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: false,
            user: null
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null
        })
      );
    }
  };
}
