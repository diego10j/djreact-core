import axios from 'axios';
import { backendUrl } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: backendUrl
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export default axiosInstance;
