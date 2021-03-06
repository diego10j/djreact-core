import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils

import { isValidToken, setSession } from '../utils/jwt';
import { llamarServicioGet, llamarServicioPost } from '../services/servicioBase';
import { getMenuOpciones } from '../layouts/dashboard/SidebarConfig';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await llamarServicioGet('/api/seguridad/renew');
          const { datos } = response.data;
          const user = {
            id: datos.ide_usua,
            displayName: datos.nombre,
            email: datos.email,
            password: '*******',
            photoURL: datos.avatar,
            phoneNumber: '+40 777666555',
            country: 'Ecuador',
            address: 'Sin Direcci???n',
            state: 'Pichincha',
            city: 'Quito',
            zipCode: '710001',
            about: '',
            role: 'admin',
            isPublic: true
          };

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await llamarServicioPost('/api/seguridad/login', {
      email,
      clave: password,
      identificacion: 'react',
      ip: '127.0.0.1',
      dispositivo: 'Web React'
    });
    const { token, datos, ...resp } = response.data;
    const user = {
      id: datos.ide_usua,
      displayName: datos.nombre,
      email: datos.email,
      password: '*******',
      photoURL: datos.avatar,
      phoneNumber: '+40 777666555',
      country: 'Ecuador',
      address: 'Sin Direcci??n',
      state: 'Pichincha',
      city: 'Quito',
      zipCode: '710001',
      about: '',
      role: 'admin',
      isPublic: true
    };
    localStorage.setItem('ultimaFecha', resp.ultimaFecha);
    localStorage.setItem('ide_empr', resp.ide_empr);
    localStorage.setItem('perm_util_perf', resp.perm_util_perf);
    localStorage.setItem('menu', JSON.stringify(resp.menu));
    localStorage.setItem('ide_usua', datos.ide_usua);
    localStorage.setItem('avatar', datos.avatar);
    localStorage.setItem('usuario', datos.identificacion);
    setSession(token);
    getMenuOpciones(); // Forma el menu de opciones
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await llamarServicioPost('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    localStorage.removeItem('menu');
    localStorage.removeItem('ide_usua');
    localStorage.removeItem('ip');
    localStorage.removeItem('ultimaFecha');
    localStorage.removeItem('usuario');
    localStorage.removeItem('avatar');
    localStorage.removeItem('ide_empr');
    localStorage.removeItem('perm_util_perf');
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => {};

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
